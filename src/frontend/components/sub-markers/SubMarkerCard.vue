<template>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click')">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold mb-2">{{ subMarker.name }}</h3>
        <p class="text-sm text-muted-foreground">
          {{ noteCount }} notas
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          Última nota: {{ formatDateShort(subMarker.createdAt) }}
        </p>
      </div>
      <div class="flex items-center gap-2" @click.stop>
        <button
          @click="$emit('edit')"
          class="p-2 hover:bg-accent rounded-md"
          aria-label="Editar sub-marcador"
        >
          ✏️
        </button>
        <button
          @click="$emit('delete')"
          class="p-2 hover:bg-destructive/10 text-destructive rounded-md"
          aria-label="Excluir sub-marcador"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SubMarker } from '~/types'
import { formatDateShort } from '~/utils/format'

interface Props {
  subMarker: SubMarker
}

const props = defineProps<Props>()

defineEmits<{
  click: []
  edit: []
  delete: []
}>()

const noteCount = computed(() => {
  if (props.subMarker._count) {
    return props.subMarker._count.notes || 0
  }
  if (props.subMarker.notes) {
    return props.subMarker.notes.length
  }
  return 0
})
</script>
