<template>
	<div class="p-2">
		<div class="flex items-start justify-between">
			<span class="inline-flex items-center">
				<UIcon name="material-symbols:grocery-sharp" class="self-center w-6 h-6 rounded-full mr-1 text-green-600 dark:text-green-600" />
				<span class="text-xl font-thin">Ürünler</span>
			</span>
			<div>
				<UButton square color="lime" @click="openModal" variant="solid" size="sm" icon="material-symbols:list-alt-add-outline-rounded"> Ürün Ekle </UButton>
			</div>
		</div>
		<div>
			<div class="">
				<UInput class="w-full py-2" v-model="searchQuery" color="white" size="sm" variant="outline" placeholder="Ürün ara..." icon="i-heroicons-magnifying-glass-20-solid" />
			</div>
		</div>
		<template v-if="isLoading || items === null">
			<!-- skeleton loading removed -->
		</template>
		<template v-else>
			<ClientOnly>
				<div v-if="items && items.length > 0" class="max-h-[32vh] border border-gray dark:border-gray-700 font-light p-2 rounded-xl overflow-auto">
					<!-- Header -->

					<!-- Grouped Catergory Items -->
					<div v-for="(items, category) in filteredGroupedItems" :key="category">
						<!--        <UDivider
          class="pl-2"
          :ui="{ border: { base: 'border-gray-200 dark:border-gray-800' } }"
        >
          <div
            class="font-extralight text-sm flex items-end text-gray-400 dark:text-gray-700"
          >
            <span class="self-center">{{ category }} ({{ items.length }})</span>
          </div>
        </UDivider> -->

						<UAccordion
							color="gray"
							variant="ghost"
							:items="[
								{
									label: `${category} ${searchQuery ? `(${items.length} sonuç)` : `(${items.length})`}`,
									icon: getIconType(category),
									content: items.map((item) => ({
										name: item.name,
										id: item.id,
									})),
									defaultOpen: searchQuery ? openCategories.includes(category) : false,
								},
							]"
						>
							<template #item="{ item }">
								<div class="space-y-2">
									<div v-for="content in item.content" :key="content.id" class="pl-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
										<div>
											<span
												class="leading-none text-md md:text-md"
												:class="{
													'bg-yellow-100 dark:bg-yellow-800/50': searchQuery && content.name.toLowerCase().includes(searchQuery.toLowerCase()),
												}"
											>
												{{ content.name }}
											</span>
										</div>
										<div class="flex">
											<UButton size="xl" class="text-green-700 dark:text-green-300 bg-transparent dark:bg-transparent border-0 p-1" variant="soft" icon="solar:cart-plus-outline" @click="addItemToShoppingList(content)" />
											<UButton size="xl" class="text-red-500 dark:text-red-300 bg-transparent dark:bg-transparent border-0 p-1" variant="soft" icon="solar:trash-bin-minimalistic-outline" @click="deleteFromPredefinedItems(content)" />
										</div>
									</div>
								</div>
							</template>
						</UAccordion>
					</div>
				</div>
			</ClientOnly>
			<ClientOnly>
				<div v-if="items && items.length === 0">
					<p class="text-center text-gray-500 py-2">Hiç ürün bulunamadı.</p>
				</div>
			</ClientOnly>
		</template>
		<!-- main div -->
	</div>
	<AddPredefinedItemsModal :isOpen="isModalOpen" @close="closeModal" />
</template>

<script lang="ts" setup>
	import type { Database } from "~/types/database.types";
	type PredefinedItem = Database["public"]["Tables"]["predefined_items"]["Row"];
	import { usePredefinedItemsStore } from "~/stores/predefinedItemsStore";
	import { useShoppingListItemsStore } from "~/stores/shoppingListItemsStore";
	import { getIconType } from "~/composables/useGetIconType";

	const isModalOpen = ref(false);
	const isClient = ref(false);
	const searchQuery = ref("");
	const openCategories = ref<string[]>([]);
	const openModal = () => (isModalOpen.value = true);
	const closeModal = () => (isModalOpen.value = false);

	// Store
	const predefinedItemsStore = usePredefinedItemsStore();
	const shoppingListStore = useShoppingListItemsStore();
	const { items, loading: isLoading } = storeToRefs(predefinedItemsStore);
	const error = ref<string | null>(null);

	// Mounted hook
	onMounted(async () => {
		isClient.value = true;
		try {
			await predefinedItemsStore.fetchAndSubscribe();
		} catch (err) {
			console.error("Error initializing predefined items:", err);
			error.value = "Failed to load items. Please try refreshing the page.";
		}
	});

	// Group items by category
	const groupedItems = computed(() => {
		if (!items.value || items.value.length === 0) return {};
		return items.value.reduce((groups: Record<string, PredefinedItem[]>, item) => {
			const category = item.category || "Diğer";
			if (!groups[category]) groups[category] = [];
			groups[category].push(item);
			return groups;
		}, {});
	});

	// Computed property to track which categories should be open
	const openCategoriesComputed = computed(() => {
		if (!searchQuery.value) return [];

		return Object.entries(filteredGroupedItems.value)
			.filter(([_, items]) => items.some((item) => item.name && item.name.toLowerCase().includes(searchQuery.value.toLowerCase())))
			.map(([category]) => category);
	});

	// Filter items based on search query
	const filteredGroupedItems = computed(() => {
		if (!searchQuery.value) return groupedItems.value;

		const query = searchQuery.value.toLowerCase();
		const filtered: Record<string, PredefinedItem[]> = {};

		Object.entries(groupedItems.value).forEach(([category, categoryItems]) => {
			const matchingItems = categoryItems.filter((item) => item.name && item.name.toLowerCase().includes(query));

			if (matchingItems.length > 0) {
				filtered[category] = matchingItems;
			}
		});

		return filtered;
	});

	// Format items for accordion with search highlighting
	const accordionItems = computed(() => {
		return Object.entries(filteredGroupedItems.value).map(([category, items]) => ({
			label: `${category} ${searchQuery.value ? `(${items.length} sonuç)` : `(${items.length})`}`,
			icon: getIconType(category),
			content: items,
			defaultOpen: openCategoriesComputed.value.includes(category),
		}));
	});

	// Delete item handler
	const deleteFromPredefinedItems = async (item: PredefinedItem) => {
		try {
			await predefinedItemsStore.deleteItem(item.id);
			const toast = useToast();
			toast.add({
				title: "Başarılı",
				description: "Ürün başarıyla silindi",
				color: "green",
			});
		} catch (error) {
			const toast = useToast();
			toast.add({
				title: "Hata",
				description: "Ürün silinirken bir hata oluştu",
				color: "red",
			});
			console.error("Failed to delete item:", error);
		}
	};

	const addItemToShoppingList = async (item: PredefinedItem) => {
		try {
			await shoppingListStore.addItemToShoppingList(item);
			useToast().add({
				title: "Başarılı",
				description: "Ürün alışveriş listenize eklendi.",
				color: "green",
			});
		} catch (error) {
			useToast().add({
				title: "Hata",
				description: error instanceof Error ? error.message : "Ürün eklenirken bir hata oluştu.",
				color: "red",
			});
			console.error("Failed to add item to shopping list:", error);
		}
	};
</script>

<style></style>
