<template>
  <header class="border-b bg-background sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          v-if="isMobile"
          @click="toggleMenu"
          class="lg:hidden p-2 hover:bg-accent rounded-md"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <NuxtLink to="/" class="text-xl font-bold">
          📝 Notas
        </NuxtLink>
      </div>
      <nav class="hidden lg:flex items-center gap-4">
        <!-- Desktop navigation -->
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const uiStore = useUIStore()

const isMobile = computed(() => {
  if (import.meta.client) {
    return window.innerWidth < 1024
  }
  return false
})

const toggleMenu = () => {
  uiStore.toggleMobileMenu()
}
</script>
