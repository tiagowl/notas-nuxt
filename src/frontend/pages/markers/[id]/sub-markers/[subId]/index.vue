<template>
  <div class="container mx-auto px-4 py-6">
    <Breadcrumb
      :items="breadcrumbItems"
    />

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ subMarker?.name || 'Carregando...' }}</h1>
      <button
        @click="navigateToCreateNote"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        + Nova Nota
      </button>
    </div>

    <div v-if="isLoading && notes.length === 0" class="text-center py-12">
      <div class="animate-spin text-4xl mb-4">⏳</div>
      <p class="text-muted-foreground">Carregando...</p>
    </div>

    <div v-else-if="error && notes.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">❌</div>
      <p class="text-destructive mb-4">{{ error }}</p>
      <button
        @click="loadNotes"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        Tentar Novamente
      </button>
    </div>

    <div v-else-if="notes.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📄</div>
      <p class="text-muted-foreground mb-4">Nenhuma nota neste sub-marcador.</p>
      <button
        @click="navigateToCreateNote"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        + Criar Primeira Nota
      </button>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @click="navigateToNote(note.id)"
        @edit="navigateToEditNote(note.id)"
        @delete="confirmDeleteNote(note)"
      />
    </div>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :is-open="!!noteToDelete"
      :title="noteToDelete?.title || ''"
      @confirm="handleDelete"
      @close="noteToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/layout/Breadcrumb.vue'
import NoteCard from '~/components/notes/NoteCard.vue'
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue'
import type { Note, SubMarker } from '~/types'
import { useNotes } from '~/composables/useNotes'
import { useUIStore } from '~/stores/ui'

const route = useRoute()
const markerId = route.params.id as string
const subMarkerId = route.params.subId as string

const { notes, isLoading, error, fetchNotes, deleteNote } = useNotes()
const uiStore = useUIStore()

const subMarker = ref<SubMarker | null>(null)
const marker = ref<{ name: string } | null>(null)
const noteToDelete = ref<Note | null>(null)

const breadcrumbItems = computed(() => {
  const items = [
    { label: 'Marcadores', path: '/' }
  ]
  
  if (marker.value) {
    items.push({ label: marker.value.name, path: `/markers/${markerId}` })
  }
  
  if (subMarker.value) {
    items.push({ label: subMarker.value.name, path: route.path })
  }
  
  return items
})

const loadData = async () => {
  try {
    const [subMarkerData, markerData] = await Promise.all([
      $fetch<SubMarker>(`/api/sub-markers/${subMarkerId}`),
      $fetch(`/api/markers/${markerId}`)
    ])
    subMarker.value = subMarkerData
    marker.value = markerData
  } catch (err) {
    // Handle error
  }
}

const loadNotes = async () => {
  await fetchNotes(subMarkerId)
}

onMounted(async () => {
  await Promise.all([loadData(), loadNotes()])
})

const navigateToCreateNote = () => {
  navigateTo(`/markers/${markerId}/sub-markers/${subMarkerId}/notes/new`)
}

const navigateToNote = (id: string) => {
  navigateTo(`/markers/${markerId}/sub-markers/${subMarkerId}/notes/${id}`)
}

const navigateToEditNote = (id: string) => {
  navigateTo(`/markers/${markerId}/sub-markers/${subMarkerId}/notes/${id}?edit=true`)
}

const confirmDeleteNote = (note: Note) => {
  noteToDelete.value = note
}

const handleDelete = async () => {
  if (!noteToDelete.value) return
  
  try {
    await deleteNote(noteToDelete.value.id)
    uiStore.showToast('Nota excluída com sucesso!', 'success')
    noteToDelete.value = null
  } catch (err) {
    uiStore.showToast('Erro ao excluir nota', 'error')
  }
}
</script>
