<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <Breadcrumb :items="breadcrumbItems" />

    <div v-if="isLoading && !note" class="text-center py-12">
      <div class="animate-spin text-4xl mb-4">⏳</div>
      <p class="text-muted-foreground">Carregando...</p>
    </div>

    <div v-else-if="error && !note" class="text-center py-12">
      <div class="text-4xl mb-4">❌</div>
      <p class="text-destructive mb-4">{{ error }}</p>
      <button
        @click="loadNote"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        Tentar Novamente
      </button>
    </div>

    <div v-else-if="isEditMode">
      <!-- Edit Mode -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Editar Nota</h1>
          <div class="flex gap-2">
            <button
              @click="exitEditMode"
              class="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {{ isSaving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>

        <NoteForm
          ref="noteFormRef"
          :initial-title="note?.title || ''"
          :initial-content="note?.content || ''"
          @update:title="editingTitle = $event"
          @update:content="editingContent = $event"
          @generate-ai="showAIModal = true"
        />
      </div>
    </div>

    <div v-else-if="note">
      <!-- View Mode -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ note.title }}</h1>
            <p class="text-sm text-muted-foreground">
              Criado em: {{ formatDate(note.createdAt) }}
              <span v-if="note.updatedAt !== note.createdAt">
                • Atualizado em: {{ formatDate(note.updatedAt) }}
              </span>
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="isEditMode = true"
              class="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              @click="confirmDeleteNote"
              class="px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors"
            >
              🗑️ Excluir
            </button>
          </div>
        </div>

        <div class="prose max-w-none border rounded-lg p-6" v-html="sanitizedContent"></div>
      </div>
    </div>

    <!-- AI Modal -->
    <AIModal
      :is-open="showAIModal"
      :is-generating="isGenerating"
      :error="aiError"
      @close="closeAIModal"
      @generate="handleAIGenerate"
      @retry="handleAIGenerate"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :is-open="showDeleteConfirm"
      :title="note?.title || ''"
      @confirm="handleDelete"
      @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/layout/Breadcrumb.vue'
import NoteForm from '~/components/notes/NoteForm.vue'
import AIModal from '~/components/ai/AIModal.vue'
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue'
import type { Note } from '~/types'
import { useNotes } from '~/composables/useNotes'
import { useAI } from '~/composables/useAI'
import { useUIStore } from '~/stores/ui'
import { formatDate } from '~/utils/format'
import { sanitizeRichText } from '~/utils/sanitize'

const route = useRoute()
const noteId = route.params.noteId as string
const markerId = route.params.id as string
const subMarkerId = route.params.subId as string

const isEditMode = ref(route.query.edit === 'true')
const noteFormRef = ref<InstanceType<typeof NoteForm> | null>(null)

const { notes, isLoading, error, fetchNotes, updateNote, deleteNote } = useNotes()
const { isGenerating, error: aiError, generateContent } = useAI()
const uiStore = useUIStore()

const note = ref<Note | null>(null)
const marker = ref<{ name: string } | null>(null)
const subMarker = ref<{ name: string } | null>(null)
const showAIModal = ref(false)
const showDeleteConfirm = ref(false)
const isSaving = ref(false)
const editingTitle = ref('')
const editingContent = ref('')

const sanitizedContent = computed(() => {
  if (!note.value) return ''
  return sanitizeRichText(note.value.content)
})

const breadcrumbItems = computed(() => {
  const items = [
    { label: 'Marcadores', path: '/' }
  ]
  
  if (marker.value) {
    items.push({ label: marker.value.name, path: `/markers/${markerId}` })
  }
  
  if (subMarker.value) {
    items.push({ label: subMarker.value.name, path: `/markers/${markerId}/sub-markers/${subMarkerId}` })
  }
  
  if (note.value) {
    items.push({ label: note.value.title, path: route.path })
  }
  
  return items
})

const loadNote = async () => {
  try {
    const data = await $fetch<Note & { subMarker: { marker: { name: string }, name: string } }>(`/api/notes/${noteId}`)
    note.value = data
    marker.value = { name: data.subMarker.marker.name }
    subMarker.value = { name: data.subMarker.name }
    editingTitle.value = data.title
    editingContent.value = data.content
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadNote()
})

const exitEditMode = () => {
  isEditMode.value = false
  if (note.value) {
    editingTitle.value = note.value.title
    editingContent.value = note.value.content
  }
  navigateTo(route.path.split('?')[0])
}

const handleSave = async () => {
  if (!noteFormRef.value?.validate() || !note.value) return
  
  isSaving.value = true
  try {
    const data = noteFormRef.value.getData()
    await updateNote(note.value.id, data)
    uiStore.showToast('Nota atualizada com sucesso!', 'success')
    isEditMode.value = false
    await loadNote()
    navigateTo(route.path.split('?')[0])
  } catch (err) {
    uiStore.showToast('Erro ao salvar nota', 'error')
  } finally {
    isSaving.value = false
  }
}

const handleAIGenerate = async (description: string) => {
  try {
    const content = await generateContent({ description })
    editingContent.value = `<p>${content}</p>`
    closeAIModal()
    uiStore.showToast('Conteúdo gerado com sucesso!', 'success')
  } catch (err) {
    // Error handled by composable
  }
}

const closeAIModal = () => {
  showAIModal.value = false
}

const confirmDeleteNote = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!note.value) return
  
  try {
    await deleteNote(note.value.id)
    uiStore.showToast('Nota excluída com sucesso!', 'success')
    navigateTo(`/markers/${markerId}/sub-markers/${subMarkerId}`)
  } catch (err) {
    uiStore.showToast('Erro ao excluir nota', 'error')
  } finally {
    showDeleteConfirm.value = false
  }
}
</script>
