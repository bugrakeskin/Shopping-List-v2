<template>
  <div>
    <NuxtLayout>
      <div class="dark:bg-gray-800 mx-auto max-w-xl min-h-screen justify-center flex flex-col">
        <NavBar />
        <NuxtPage class="flex-grow" />
        <Footer />
        <UNotifications />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
});

const { getVersion } = useVersion();
onMounted(() => {
  getVersion();
});
</script>
