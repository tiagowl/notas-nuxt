import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref(false)
  const isLoading = ref(false)
  const toast = ref<{
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    id: number
  } | null>(null)

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }

  function openMobileMenu() {
    isMobileMenuOpen.value = true
  }

  function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    toast.value = {
      message,
      type,
      id: Date.now()
    }
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      toast.value = null
    }, 3000)
  }

  function hideToast() {
    toast.value = null
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return {
    isMobileMenuOpen: readonly(isMobileMenuOpen),
    isLoading: readonly(isLoading),
    toast: readonly(toast),
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
    showToast,
    hideToast,
    setLoading
  }
})
