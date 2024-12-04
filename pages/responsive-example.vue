<!-- pages/responsive-example.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Responsive Design Example
          </h1>
          <!-- Mobile menu button -->
          <button class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900">
            <span class="sr-only">Open menu</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Grid Layout Example -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card 1 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <div class="bg-gray-200 rounded-md w-full h-48"></div>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold mb-2">Responsive Card 1</h2>
          <p class="text-gray-600 text-sm sm:text-base">
            This card adjusts its size based on the screen width. Try resizing your browser!
          </p>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <div class="bg-gray-200 rounded-md w-full h-48"></div>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold mb-2">Responsive Card 2</h2>
          <p class="text-gray-600 text-sm sm:text-base">
            The grid layout changes from 1 column on mobile to 3 columns on desktop.
          </p>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <div class="bg-gray-200 rounded-md w-full h-48"></div>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold mb-2">Responsive Card 3</h2>
          <p class="text-gray-600 text-sm sm:text-base">
            Font sizes and spacing adjust automatically for different screen sizes.
          </p>
        </div>
      </div>

      <!-- Responsive Text Section -->
      <div class="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          Responsive Typography
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-prose">
          This text automatically adjusts its size based on the screen width. It uses different
          text sizes for mobile (sm), tablet (md), and desktop (lg) viewports. The container
          also has responsive padding and margin.
        </p>
      </div>

      <!-- Responsive Flex Container -->
      <div class="mt-12 bg-white rounded-lg shadow-md p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <h3 class="text-lg sm:text-xl font-semibold mb-2">Flex Item 1</h3>
            <p class="text-gray-600 text-sm sm:text-base">
              This flex container switches between column and row layout based on screen size.
            </p>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-xl font-semibold mb-2">Flex Item 2</h3>
            <p class="text-gray-600 text-sm sm:text-base">
              On mobile, items stack vertically. On desktop, they align horizontally.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// No additional script needed for this example
</script>
