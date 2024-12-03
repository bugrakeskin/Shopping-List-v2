<template>
	<div class="p-4 gap-2">
		<ErrorBoundary can-retry>
			<ShoppingList />
		</ErrorBoundary>
		<ErrorBoundary can-retry>
			<PredefinedItems />
		</ErrorBoundary>
	</div>
</template>

<script lang="ts" setup>
import ErrorBoundary from '~/components/ErrorBoundary.vue'
</script>

<style></style>
