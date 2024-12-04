<template>
  <div>
    <nav class="block w-full max-w-screen-lg px-4 py-2 mx-auto bg-white dark:bg-gray-800 shadow-sm rounded-md lg:px-8 lg:py-3 mt-2">
      <div class="container flex flex-wrap items-center justify-between mx-auto text-slate-800 dark:text-gray-100">
        <div class="inline-flex items-center justify-between w-auto">
          <span class="text-amber-500 dark:text-amber-400 text-base font-mono">[MB]</span>
          <a href="#" class="block cursor-pointer py-1.5 text-base text-slate-800 dark:text-gray-100 font-light ml-2">Shopping List</a>
        </div>
        <div class="hidden lg:block">
          <ul class="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600 dark:text-gray-300">
              <Icon name="material-symbols:list-alt-check-outline-rounded" class="h-6 w-6 text-slate-500 dark:text-gray-400" />
              <NuxtLink to="/" class="flex items-center">Alışveriş Listesi</NuxtLink>
            </li>
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600 dark:text-gray-300">
              <Icon name="fluent:history-32-regular" class="h-6 w-6 text-slate-500 dark:text-gray-400" />
              <NuxtLink to="/history" class="flex items-center">Geçmiş</NuxtLink>
            </li>
          </ul>
        </div>

        <button
          @click="isOpen = !isOpen"
          class="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
          type="button"
        >
          <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 dark:stroke-gray-100" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </span>
        </button>

        <div v-show="isOpen" class="w-full lg:hidden">
          <ul class="flex flex-col gap-2 mt-4">
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600 dark:text-gray-300">
              <Icon name="material-symbols:list-alt-check-outline-rounded" class="h-6 w-6 text-slate-500 dark:text-gray-400" />
              <NuxtLink to="/" class="flex items-center" @click="isOpen = false">Alışveriş Listesi</NuxtLink>
            </li>
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600 dark:text-gray-300">
              <Icon name="fluent:history-32-regular" class="h-6 w-6 text-slate-500 dark:text-gray-400" />
              <NuxtLink to="/history" class="flex items-center" @click="isOpen = false">Geçmiş</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const isOpen = ref(false);
</script>

<style></style>
