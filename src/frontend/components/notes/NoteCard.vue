<template>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click')">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold mb-2">{{ note.title }}</h3>
        <p class="text-sm text-muted-foreground line-clamp-2">
          {{ preview }}
        </p>
        <p class="text-xs text-muted-foreground mt-2">
          Última edição: {{ formatDate(note.updatedAt) }}
        </p>
      </div>
      <div class="flex items-center gap-2" @click.stop>
        <button
          @click="$emit('edit')"
          class="p-2 hover:bg-accent rounded-md"
          aria-label="Editar nota"
        >
          ✏️
        </button>
        <button
          @click="$emit('delete')"
          class="p-2 hover:bg-destructive/10 text-destructive rounded-md"
          aria-label="Excluir nota"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '~/types'
import { formatDate } from '~/utils/format'

interface Props {
  note: Note
}

const props = defineProps<Props>()

defineEmits<{
  click: []
  edit: []
  delete: []
}>()

const preview = computed(() => {
  // Strip HTML tags for preview
  const text = props.note.content.replace(/<[^>]*>/g, '')
  return text.length > 100 ? text.substring(0, 100) + '...' : text
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
