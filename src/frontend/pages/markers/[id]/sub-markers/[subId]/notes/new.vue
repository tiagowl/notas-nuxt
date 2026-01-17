<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <Breadcrumb :items="breadcrumbItems" />

    <div v-if="isLoading && !subMarker" class="text-center py-12">
      <div class="animate-spin text-4xl mb-4">⏳</div>
      <p class="text-muted-foreground">Carregando...</p>
    </div>

    <div v-else-if="subMarker" class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Nova Nota</h1>
        <div class="flex gap-2">
          <button
            @click="handleCancel"
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
        @update:title="editingTitle = $event"
        @update:content="editingContent = $event"
        @generate-ai="showAIModal = true"
      />
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
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/layout/Breadcrumb.vue'
import NoteForm from '~/components/notes/NoteForm.vue'
import AIModal from '~/components/ai/AIModal.vue'
import type { SubMarker } from '~/types'
import { useNotes } from '~/composables/useNotes'
import { useAI } from '~/composables/useAI'
import { useUIStore } from '~/stores/ui'

const route = useRoute()
const markerId = route.params.id as string
const subMarkerId = route.params.subId as string

const noteFormRef = ref<InstanceType<typeof NoteForm> | null>(null)

const { isLoading, createNote } = useNotes()
const { isGenerating, error: aiError, generateContent } = useAI()
const uiStore = useUIStore()

const subMarker = ref<SubMarker | null>(null)
const marker = ref<{ name: string } | null>(null)
const showAIModal = ref(false)
const isSaving = ref(false)
const editingTitle = ref('')
const editingContent = ref('')

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
  
  items.push({ label: 'Nova Nota', path: route.path })
  
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

onMounted(() => {
  loadData()
})

const handleSave = async () => {
  if (!noteFormRef.value?.validate() || !subMarker.value) return
  
  isSaving.value = true
  try {
    const data = noteFormRef.value.getData()
    const newNote = await createNote({
      ...data,
      subMarkerId: subMarker.value.id
    })
    uiStore.showToast('Nota criada com sucesso!', 'success')
    navigateTo(`/markers/${markerId}/sub-markers/${subMarkerId}/notes/${newNote.id}`)
  } catch (err) {
    uiStore.showToast('Erro ao criar nota', 'error')
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  navigateTo(`/markers/${markerId}/sub-markers/${subMarkerId}`)
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
</script>
