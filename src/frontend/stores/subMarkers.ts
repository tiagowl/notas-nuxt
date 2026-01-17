import { defineStore } from 'pinia'
import type { SubMarker } from '~/types'

export const useSubMarkersStore = defineStore('subMarkers', () => {
  const subMarkers = ref<SubMarker[]>([])
  const selectedSubMarkerId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const selectedSubMarker = computed(() => 
    subMarkers.value.find(sm => sm.id === selectedSubMarkerId.value) || null
  )

  const subMarkerCount = computed(() => subMarkers.value.length)

  function setSubMarkers(newSubMarkers: SubMarker[]) {
    subMarkers.value = newSubMarkers
  }

  function addSubMarker(subMarker: SubMarker) {
    subMarkers.value.push(subMarker)
  }

  function updateSubMarker(id: string, updates: Partial<SubMarker>) {
    const index = subMarkers.value.findIndex(sm => sm.id === id)
    if (index !== -1) {
      subMarkers.value[index] = { ...subMarkers.value[index], ...updates }
    }
  }

  function removeSubMarker(id: string) {
    subMarkers.value = subMarkers.value.filter(sm => sm.id !== id)
    if (selectedSubMarkerId.value === id) {
      selectedSubMarkerId.value = null
    }
  }

  function setSelectedSubMarker(id: string | null) {
    selectedSubMarkerId.value = id
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(err: string | null) {
    error.value = err
  }

  function getByMarkerId(markerId: string): SubMarker[] {
    return subMarkers.value.filter(sm => sm.markerId === markerId)
  }

  return {
    subMarkers: readonly(subMarkers),
    selectedSubMarkerId,
    selectedSubMarker,
    subMarkerCount,
    isLoading: readonly(isLoading),
    error: readonly(error),
    setSubMarkers,
    addSubMarker,
    updateSubMarker,
    removeSubMarker,
    setSelectedSubMarker,
    setLoading,
    setError,
    getByMarkerId
  }
})
