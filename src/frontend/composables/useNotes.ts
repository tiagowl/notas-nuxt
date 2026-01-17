import type { Note, CreateNoteDto, UpdateNoteDto } from '~/types'
import { useNotesStore } from '~/stores/notes'

export const useNotes = () => {
  const notesStore = useNotesStore()

  const fetchNotes = async (subMarkerId: string) => {
    try {
      notesStore.setLoading(true)
      notesStore.setError(null)
      
      const data = await $fetch<Note[]>('/api/notes', {
        params: { subMarkerId }
      })
      notesStore.setNotes(data)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar notas'
      notesStore.setError(errorMessage)
      throw error
    } finally {
      notesStore.setLoading(false)
    }
  }

  const createNote = async (dto: CreateNoteDto): Promise<Note> => {
    try {
      notesStore.setLoading(true)
      notesStore.setError(null)
      
      const note = await $fetch<Note>('/api/notes', {
        method: 'POST',
        body: dto
      })
      
      notesStore.addNote(note)
      return note
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar nota'
      notesStore.setError(errorMessage)
      throw error
    } finally {
      notesStore.setLoading(false)
    }
  }

  const updateNote = async (id: string, dto: UpdateNoteDto): Promise<Note> => {
    try {
      notesStore.setLoading(true)
      notesStore.setError(null)
      
      const note = await $fetch<Note>(`/api/notes/${id}`, {
        method: 'PUT',
        body: dto
      })
      
      notesStore.updateNote(id, note)
      return note
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar nota'
      notesStore.setError(errorMessage)
      throw error
    } finally {
      notesStore.setLoading(false)
    }
  }

  const deleteNote = async (id: string): Promise<void> => {
    try {
      notesStore.setLoading(true)
      notesStore.setError(null)
      
      await $fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      })
      
      notesStore.removeNote(id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir nota'
      notesStore.setError(errorMessage)
      throw error
    } finally {
      notesStore.setLoading(false)
    }
  }

  return {
    notes: computed(() => notesStore.notes),
    selectedNote: computed(() => notesStore.selectedNote),
    isLoading: computed(() => notesStore.isLoading),
    error: computed(() => notesStore.error),
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setSelectedNote: (id: string | null) => notesStore.setSelectedNote(id),
    getBySubMarkerId: (subMarkerId: string) => notesStore.getBySubMarkerId(subMarkerId)
  }
}
