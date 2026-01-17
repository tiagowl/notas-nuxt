import type { Marker, CreateMarkerDto, UpdateMarkerDto } from '~/types'
import { useMarkersStore } from '~/stores/markers'

export const useMarkers = () => {
  const markersStore = useMarkersStore()

  const fetchMarkers = async () => {
    try {
      markersStore.setLoading(true)
      markersStore.setError(null)
      
      const data = await $fetch<Marker[]>('/api/markers')
      markersStore.setMarkers(data)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar marcadores'
      markersStore.setError(errorMessage)
      throw error
    } finally {
      markersStore.setLoading(false)
    }
  }

  const createMarker = async (dto: CreateMarkerDto): Promise<Marker> => {
    try {
      markersStore.setLoading(true)
      markersStore.setError(null)
      
      const marker = await $fetch<Marker>('/api/markers', {
        method: 'POST',
        body: dto
      })
      
      markersStore.addMarker(marker)
      return marker
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar marcador'
      markersStore.setError(errorMessage)
      throw error
    } finally {
      markersStore.setLoading(false)
    }
  }

  const updateMarker = async (id: string, dto: UpdateMarkerDto): Promise<Marker> => {
    try {
      markersStore.setLoading(true)
      markersStore.setError(null)
      
      const marker = await $fetch<Marker>(`/api/markers/${id}`, {
        method: 'PUT',
        body: dto
      })
      
      markersStore.updateMarker(id, marker)
      return marker
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar marcador'
      markersStore.setError(errorMessage)
      throw error
    } finally {
      markersStore.setLoading(false)
    }
  }

  const deleteMarker = async (id: string): Promise<void> => {
    try {
      markersStore.setLoading(true)
      markersStore.setError(null)
      
      await $fetch(`/api/markers/${id}`, {
        method: 'DELETE'
      })
      
      markersStore.removeMarker(id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir marcador'
      markersStore.setError(errorMessage)
      throw error
    } finally {
      markersStore.setLoading(false)
    }
  }

  return {
    markers: computed(() => markersStore.markers),
    selectedMarker: computed(() => markersStore.selectedMarker),
    isLoading: computed(() => markersStore.isLoading),
    error: computed(() => markersStore.error),
    fetchMarkers,
    createMarker,
    updateMarker,
    deleteMarker,
    setSelectedMarker: (id: string | null) => markersStore.setSelectedMarker(id)
  }
}
