<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="toast"
      class="fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 min-w-[300px]"
      :class="{
        'border-green-500 bg-green-50 dark:bg-green-950': toast.type === 'success',
        'border-red-500 bg-red-50 dark:bg-red-950': toast.type === 'error',
        'border-blue-500 bg-blue-50 dark:bg-blue-950': toast.type === 'info',
        'border-yellow-500 bg-yellow-50 dark:bg-yellow-950': toast.type === 'warning'
      }"
    >
      <div class="flex items-start justify-between gap-4">
        <p class="text-sm font-medium">{{ toast.message }}</p>
        <button
          @click="uiStore.hideToast()"
          class="text-muted-foreground hover:text-foreground"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const uiStore = useUIStore()
const toast = computed(() => uiStore.toast)
</script>
