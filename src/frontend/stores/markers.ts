import { defineStore } from 'pinia'
import type { Marker } from '~/types'

export const useMarkersStore = defineStore('markers', () => {
  const markers = ref<Marker[]>([])
  const selectedMarkerId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const selectedMarker = computed(() => 
    markers.value.find(m => m.id === selectedMarkerId.value) || null
  )

  const markerCount = computed(() => markers.value.length)

  function setMarkers(newMarkers: Marker[]) {
    markers.value = newMarkers
  }

  function addMarker(marker: Marker) {
    markers.value.push(marker)
  }

  function updateMarker(id: string, updates: Partial<Marker>) {
    const index = markers.value.findIndex(m => m.id === id)
    if (index !== -1) {
      markers.value[index] = { ...markers.value[index], ...updates }
    }
  }

  function removeMarker(id: string) {
    markers.value = markers.value.filter(m => m.id !== id)
    if (selectedMarkerId.value === id) {
      selectedMarkerId.value = null
    }
  }

  function setSelectedMarker(id: string | null) {
    selectedMarkerId.value = id
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(err: string | null) {
    error.value = err
  }

  return {
    markers: readonly(markers),
    selectedMarkerId,
    selectedMarker,
    markerCount,
    isLoading: readonly(isLoading),
    error: readonly(error),
    setMarkers,
    addMarker,
    updateMarker,
    removeMarker,
    setSelectedMarker,
    setLoading,
    setError
  }
})
