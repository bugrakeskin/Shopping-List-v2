<template>
	<div>
		<NuxtLayout>
			<div class="dark:bg-gray-800 mx-auto max-w-xl min-h-screen flex flex-col">
				<NavBar2 />
				<NuxtPage class="flex-grow" />
				<Footer />
				<UNotifications />
			</div>
		</NuxtLayout>
	</div>
</template>

<script setup>
useHead({
	viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
})

const { getVersion } = useVersion()
onMounted(() => {
	getVersion()
})
</script>
