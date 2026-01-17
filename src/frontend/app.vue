<template>
  <div class="min-h-screen bg-background">
    <Header />
    <main>
      <NuxtPage />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue'
import Toast from '~/components/ui/Toast.vue'

useHead({
  title: 'Notas - Sistema de Gerenciamento',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
