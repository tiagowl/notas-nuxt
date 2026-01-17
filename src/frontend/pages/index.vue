<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Marcadores</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        + Novo Marcador
      </button>
    </div>

    <div v-if="isLoading && markers.length === 0" class="text-center py-12">
      <div class="animate-spin text-4xl mb-4">⏳</div>
      <p class="text-muted-foreground">Carregando...</p>
    </div>

    <div v-else-if="error && markers.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">❌</div>
      <p class="text-destructive mb-4">{{ error }}</p>
      <button
        @click="fetchMarkers"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        Tentar Novamente
      </button>
    </div>

    <div v-else-if="markers.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📁</div>
      <p class="text-muted-foreground mb-4">Nenhum marcador criado ainda.</p>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        + Criar Primeiro Marcador
      </button>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MarkerCard
        v-for="marker in markers"
        :key="marker.id"
        :marker="marker"
        @click="navigateToMarker(marker.id)"
        @edit="editMarker(marker)"
        @delete="confirmDeleteMarker(marker)"
      />
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingMarker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeModal"
    >
      <div class="bg-background border rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingMarker ? 'Editar Marcador' : 'Criar Novo Marcador' }}
        </h2>
        <MarkerForm
          :initial-value="editingMarker?.name"
          :submit-label="editingMarker ? 'Salvar Alterações' : 'Criar Marcador'"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :is-open="!!markerToDelete"
      :title="markerToDelete?.name || ''"
      @confirm="handleDelete"
      @close="markerToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import MarkerCard from '~/components/markers/MarkerCard.vue'
import MarkerForm from '~/components/markers/MarkerForm.vue'
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue'
import type { Marker } from '~/types'
import { useMarkers } from '~/composables/useMarkers'
import { useUIStore } from '~/stores/ui'

const { markers, isLoading, error, fetchMarkers, createMarker, updateMarker, deleteMarker } = useMarkers()
const uiStore = useUIStore()

const showCreateModal = ref(false)
const editingMarker = ref<Marker | null>(null)
const markerToDelete = ref<Marker | null>(null)

onMounted(() => {
  fetchMarkers()
})

const navigateToMarker = (id: string) => {
  navigateTo(`/markers/${id}`)
}

const editMarker = (marker: Marker) => {
  editingMarker.value = marker
  showCreateModal.value = false
}

const confirmDeleteMarker = (marker: Marker) => {
  markerToDelete.value = marker
}

const handleSubmit = async (name: string) => {
  try {
    if (editingMarker.value) {
      await updateMarker(editingMarker.value.id, { name })
      uiStore.showToast('Marcador atualizado com sucesso!', 'success')
    } else {
      await createMarker({ name })
      uiStore.showToast('Marcador criado com sucesso!', 'success')
    }
    closeModal()
  } catch (err) {
    uiStore.showToast('Erro ao salvar marcador', 'error')
  }
}

const handleDelete = async () => {
  if (!markerToDelete.value) return
  
  try {
    await deleteMarker(markerToDelete.value.id)
    uiStore.showToast('Marcador excluído com sucesso!', 'success')
    markerToDelete.value = null
  } catch (err) {
    uiStore.showToast('Erro ao excluir marcador', 'error')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingMarker.value = null
}
</script>
