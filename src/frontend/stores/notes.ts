import { defineStore } from 'pinia'
import type { Note } from '~/types'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const selectedNoteId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const selectedNote = computed(() => 
    notes.value.find(n => n.id === selectedNoteId.value) || null
  )

  const noteCount = computed(() => notes.value.length)

  function setNotes(newNotes: Note[]) {
    notes.value = newNotes
  }

  function addNote(note: Note) {
    notes.value.push(note)
  }

  function updateNote(id: string, updates: Partial<Note>) {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...updates }
    }
  }

  function removeNote(id: string) {
    notes.value = notes.value.filter(n => n.id !== id)
    if (selectedNoteId.value === id) {
      selectedNoteId.value = null
    }
  }

  function setSelectedNote(id: string | null) {
    selectedNoteId.value = id
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(err: string | null) {
    error.value = err
  }

  function getBySubMarkerId(subMarkerId: string): Note[] {
    return notes.value.filter(n => n.subMarkerId === subMarkerId)
  }

  return {
    notes: readonly(notes),
    selectedNoteId,
    selectedNote,
    noteCount,
    isLoading: readonly(isLoading),
    error: readonly(error),
    setNotes,
    addNote,
    updateNote,
    removeNote,
    setSelectedNote,
    setLoading,
    setError,
    getBySubMarkerId
  }
})
