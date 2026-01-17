<template>
  <div class="container mx-auto px-4 py-6">
    <Breadcrumb
      :items="[
        { label: 'Marcadores', path: '/' },
        { label: marker?.name || 'Carregando...', path: `/markers/${route.params.id}` }
      ]"
    />

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ marker?.name || 'Carregando...' }}</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        + Novo Sub-marcador
      </button>
    </div>

    <div v-if="isLoading && subMarkers.length === 0" class="text-center py-12">
      <div class="animate-spin text-4xl mb-4">⏳</div>
      <p class="text-muted-foreground">Carregando...</p>
    </div>

    <div v-else-if="error && subMarkers.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">❌</div>
      <p class="text-destructive mb-4">{{ error }}</p>
      <button
        @click="loadSubMarkers"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        Tentar Novamente
      </button>
    </div>

    <div v-else-if="subMarkers.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📂</div>
      <p class="text-muted-foreground mb-4">Nenhum sub-marcador criado ainda.</p>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        + Criar Sub-marcador
      </button>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SubMarkerCard
        v-for="subMarker in subMarkers"
        :key="subMarker.id"
        :sub-marker="subMarker"
        @click="navigateToSubMarker(subMarker.id)"
        @edit="editSubMarker(subMarker)"
        @delete="confirmDeleteSubMarker(subMarker)"
      />
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingSubMarker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeModal"
    >
      <div class="bg-background border rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingSubMarker ? 'Editar Sub-marcador' : 'Criar Novo Sub-marcador' }}
        </h2>
        <MarkerForm
          :initial-value="editingSubMarker?.name"
          :submit-label="editingSubMarker ? 'Salvar Alterações' : 'Criar Sub-marcador'"
          placeholder="Digite o nome do sub-marcador..."
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :is-open="!!subMarkerToDelete"
      :title="subMarkerToDelete?.name || ''"
      @confirm="handleDelete"
      @close="subMarkerToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/layout/Breadcrumb.vue'
import SubMarkerCard from '~/components/sub-markers/SubMarkerCard.vue'
import MarkerForm from '~/components/markers/MarkerForm.vue'
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue'
import type { SubMarker } from '~/types'
import { useSubMarkers } from '~/composables/useSubMarkers'
import { useUIStore } from '~/stores/ui'

const route = useRoute()
const markerId = route.params.id as string

const { subMarkers, isLoading, error, fetchSubMarkers, createSubMarker, updateSubMarker, deleteSubMarker } = useSubMarkers()
const uiStore = useUIStore()

const marker = ref<{ name: string } | null>(null)
const showCreateModal = ref(false)
const editingSubMarker = ref<SubMarker | null>(null)
const subMarkerToDelete = ref<SubMarker | null>(null)

const loadMarker = async () => {
  try {
    const data = await $fetch(`/api/markers/${markerId}`)
    marker.value = data
  } catch (err) {
    // Handle error
  }
}

const loadSubMarkers = async () => {
  await fetchSubMarkers(markerId)
}

onMounted(async () => {
  await Promise.all([loadMarker(), loadSubMarkers()])
})

const navigateToSubMarker = (id: string) => {
  navigateTo(`/markers/${markerId}/sub-markers/${id}`)
}

const editSubMarker = (subMarker: SubMarker) => {
  editingSubMarker.value = subMarker
  showCreateModal.value = false
}

const confirmDeleteSubMarker = (subMarker: SubMarker) => {
  subMarkerToDelete.value = subMarker
}

const handleSubmit = async (name: string) => {
  try {
    if (editingSubMarker.value) {
      await updateSubMarker(editingSubMarker.value.id, { name })
      uiStore.showToast('Sub-marcador atualizado com sucesso!', 'success')
    } else {
      await createSubMarker({ name, markerId })
      uiStore.showToast('Sub-marcador criado com sucesso!', 'success')
    }
    closeModal()
  } catch (err) {
    uiStore.showToast('Erro ao salvar sub-marcador', 'error')
  }
}

const handleDelete = async () => {
  if (!subMarkerToDelete.value) return
  
  try {
    await deleteSubMarker(subMarkerToDelete.value.id)
    uiStore.showToast('Sub-marcador excluído com sucesso!', 'success')
    subMarkerToDelete.value = null
  } catch (err) {
    uiStore.showToast('Erro ao excluir sub-marcador', 'error')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingSubMarker.value = null
}
</script>
