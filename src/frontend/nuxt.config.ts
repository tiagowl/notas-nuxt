// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  
  css: ['~/assets/css/main.css'],
  
  components: true,
  
  runtimeConfig: {
    huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY || '',
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },
  
  app: {
    head: {
      title: 'Notas - Sistema de Gerenciamento',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de gerenciamento de notas hierárquico' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
