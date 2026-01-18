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
    // Para melhor qualidade em seguir instruções (estilo ChatGPT), recomenda-se:
    // - 'meta-llama/Llama-3.1-8B-Instruct' (melhor para seguir comandos específicos)
    // - 'mistralai/Mistral-7B-Instruct-v0.2' (bom para instruções gerais)
    // Configure via HUGGING_FACE_MODEL no .env
    huggingFaceModel: process.env.HUGGING_FACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
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
