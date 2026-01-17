<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div class="bg-background border rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex items-center gap-4 mb-4">
        <div class="text-2xl">⚠️</div>
        <h2 class="text-xl font-semibold">Confirmar Exclusão</h2>
      </div>
      
      <div class="mb-4">
        <p class="text-muted-foreground mb-2">Você está prestes a excluir:</p>
        <p class="font-medium">{{ title }}</p>
        <p class="text-sm text-muted-foreground mt-2">Esta ação não pode ser desfeita.</p>
      </div>
      
      <div class="flex justify-end gap-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Excluir Definitivamente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
}

defineProps<Props>()

defineEmits<{
  close: []
  confirm: []
}>()
</script>
