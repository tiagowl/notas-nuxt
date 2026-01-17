import type { SubMarker, CreateSubMarkerDto, UpdateSubMarkerDto } from '~/types'
import { useSubMarkersStore } from '~/stores/subMarkers'

export const useSubMarkers = () => {
  const subMarkersStore = useSubMarkersStore()

  const fetchSubMarkers = async (markerId: string) => {
    try {
      subMarkersStore.setLoading(true)
      subMarkersStore.setError(null)
      
      const data = await $fetch<SubMarker[]>('/api/sub-markers', {
        params: { markerId }
      })
      subMarkersStore.setSubMarkers(data)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar sub-marcadores'
      subMarkersStore.setError(errorMessage)
      throw error
    } finally {
      subMarkersStore.setLoading(false)
    }
  }

  const createSubMarker = async (dto: CreateSubMarkerDto): Promise<SubMarker> => {
    try {
      subMarkersStore.setLoading(true)
      subMarkersStore.setError(null)
      
      const subMarker = await $fetch<SubMarker>('/api/sub-markers', {
        method: 'POST',
        body: dto
      })
      
      subMarkersStore.addSubMarker(subMarker)
      return subMarker
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar sub-marcador'
      subMarkersStore.setError(errorMessage)
      throw error
    } finally {
      subMarkersStore.setLoading(false)
    }
  }

  const updateSubMarker = async (id: string, dto: UpdateSubMarkerDto): Promise<SubMarker> => {
    try {
      subMarkersStore.setLoading(true)
      subMarkersStore.setError(null)
      
      const subMarker = await $fetch<SubMarker>(`/api/sub-markers/${id}`, {
        method: 'PUT',
        body: dto
      })
      
      subMarkersStore.updateSubMarker(id, subMarker)
      return subMarker
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar sub-marcador'
      subMarkersStore.setError(errorMessage)
      throw error
    } finally {
      subMarkersStore.setLoading(false)
    }
  }

  const deleteSubMarker = async (id: string): Promise<void> => {
    try {
      subMarkersStore.setLoading(true)
      subMarkersStore.setError(null)
      
      await $fetch(`/api/sub-markers/${id}`, {
        method: 'DELETE'
      })
      
      subMarkersStore.removeSubMarker(id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir sub-marcador'
      subMarkersStore.setError(errorMessage)
      throw error
    } finally {
      subMarkersStore.setLoading(false)
    }
  }

  return {
    subMarkers: computed(() => subMarkersStore.subMarkers),
    selectedSubMarker: computed(() => subMarkersStore.selectedSubMarker),
    isLoading: computed(() => subMarkersStore.isLoading),
    error: computed(() => subMarkersStore.error),
    fetchSubMarkers,
    createSubMarker,
    updateSubMarker,
    deleteSubMarker,
    setSelectedSubMarker: (id: string | null) => subMarkersStore.setSelectedSubMarker(id),
    getByMarkerId: (markerId: string) => subMarkersStore.getByMarkerId(markerId)
  }
}
