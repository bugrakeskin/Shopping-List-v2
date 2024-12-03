<template>
	<div class="">
		<div v-if="isLoading" class="space-y-4">
			<UCard v-for="card in 3" :key="card" class="space-y-4 p-4">
				<!-- Header Skeleton -->
				<div class="flex items-start justify-between mb-4">
					<div class="grid space-y-2">
						<USkeleton class="h-10 w-10 rounded-full" />
						<USkeleton class="h-4 w-16" />
					</div>
					<USkeleton class="h-8 w-24" />
				</div>

				<!-- Items Skeleton -->
				<div class="space-y-3">
					<div v-for="i in 5" :key="i" class="flex items-center justify-between">
						<USkeleton class="h-6 w-6 rounded-full" />
						<USkeleton class="h-4 w-[70%]" />
						<USkeleton class="h-4 w-12" />
					</div>
				</div>

				<!-- Footer Skeleton -->
				<div class="flex justify-end mt-4">
					<USkeleton class="h-8 w-32" />
				</div>
			</UCard>
		</div>
		<template v-else>
			<ErrorBoundary can-retry>
				<div>
					<ShoppingList />
				</div>
			</ErrorBoundary>
			<ErrorBoundary can-retry>
				<PredefinedItems />
			</ErrorBoundary>
		</template>
	</div>
</template>

<script lang="ts" setup>
	import ErrorBoundary from "~/components/ErrorBoundary.vue";
	import { ref, onMounted } from "vue";

	const isLoading = ref(true);

	onMounted(() => {
		// Simüle edilmiş yükleme süresi (isteğe bağlı olarak değiştirilebilir)
		setTimeout(() => {
			isLoading.value = false;
		}, 500);
	});
</script>

<style></style>
