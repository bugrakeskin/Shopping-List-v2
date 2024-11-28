<template>
  <nav class="container mx-auto max-w-xl ">
    <div class="w-full flex justify-center mb-6 rounded-xl">
      <UButtonGroup class="w-full flex items-center justify-center">
        <UButton
          class="flex-1 flex items-center justify-center h-12  md:text-xl"
          icon="material-symbols:list-alt-check-outline-rounded"
          color="gray"
          variant="solid"
          label="Ana Sayfa"
        />
        <UButton
          class="flex-1 flex items-center justify-center h-12 md:text-xl"
          icon="ic:round-history"
          color="gray"
          variant="solid"
          label="Geçmiş"
        />
      </UButtonGroup>
    </div>
  </nav>
</template>

<script lang="ts" setup></script>

<style></style>
