<template>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click')">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold mb-2">{{ marker.name }}</h3>
        <p class="text-sm text-muted-foreground">
          {{ subMarkerCount }} sub-marcadores • {{ noteCount }} notas
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          Criado em: {{ formatDateShort(marker.createdAt) }}
        </p>
      </div>
      <div class="flex items-center gap-2" @click.stop>
        <button
          @click="$emit('edit')"
          class="p-2 hover:bg-accent rounded-md"
          aria-label="Editar marcador"
        >
          ✏️
        </button>
        <button
          @click="$emit('delete')"
          class="p-2 hover:bg-destructive/10 text-destructive rounded-md"
          aria-label="Excluir marcador"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Marker } from '~/types'
import { formatDateShort } from '~/utils/format'

interface Props {
  marker: Marker
}

const props = defineProps<Props>()

defineEmits<{
  click: []
  edit: []
  delete: []
}>()

const subMarkerCount = computed(() => {
  return props.marker._count?.subMarkers ?? 0
})

const noteCount = computed(() => {
  return props.marker._count?.notes ?? 0
})
</script>
