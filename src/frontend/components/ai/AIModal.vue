<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div class="bg-background border rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">
          {{ isGenerating ? 'Gerando Conteúdo...' : 'Gerar Conteúdo com IA' }}
        </h2>
        <button
          v-if="!isGenerating"
          @click="$emit('close')"
          class="p-2 hover:bg-accent rounded-md"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
      
      <div v-if="isGenerating" class="text-center py-8">
        <div class="animate-spin text-4xl mb-4">🔄</div>
        <p class="text-muted-foreground">
          Gerando seu conteúdo...
        </p>
        <p class="text-sm text-muted-foreground mt-2">
          Isso pode levar alguns segundos.
        </p>
      </div>
      
      <div v-else-if="error" class="space-y-4">
        <div class="bg-destructive/10 border border-destructive rounded-lg p-4">
          <p class="text-destructive font-medium mb-2">❌ Erro ao Gerar Conteúdo</p>
          <p class="text-sm text-muted-foreground mb-3">{{ error }}</p>
          
          <!-- Instruções de troubleshooting para erro 401/403 -->
          <div v-if="error.includes('autenticação') || error.includes('401') || error.includes('403')" class="mt-4 pt-4 border-t border-destructive/20">
            <p class="text-sm font-medium text-destructive mb-2">Como resolver:</p>
            <ol class="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Verifique se o arquivo <code class="bg-background px-1 rounded">.env</code> existe na raiz do projeto</li>
              <li>Confirme que <code class="bg-background px-1 rounded">HUGGING_FACE_API_KEY</code> está definido no .env</li>
              <li>Verifique se o token começa com <code class="bg-background px-1 rounded">hf_</code></li>
              <li>Acesse <a href="https://huggingface.co/settings/tokens" target="_blank" class="text-primary underline">https://huggingface.co/settings/tokens</a> e verifique as permissões do token</li>
              <li>Certifique-se de que o token tem a permissão <strong>"Make calls to Inference Providers"</strong> habilitada</li>
              <li>Se necessário, crie um novo token com as permissões corretas</li>
            </ol>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            Fechar
          </button>
          <button
            @click="$emit('retry')"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div>
          <label for="description" class="block text-sm font-medium mb-2">
            Descreva o conteúdo que você deseja gerar:
          </label>
          <textarea
            id="description"
            v-model="description"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
            placeholder="Seja específico! Exemplo:&#10;&#10;Escreva um resumo sobre derivadas parciais explicando: o que são, como calcular e suas aplicações práticas em problemas de otimização. Use linguagem acessível para estudantes universitários.&#10;&#10;Dicas:&#10;- Seja claro sobre o tema e público-alvo&#10;- Mencione o formato desejado (resumo, explicação, lista, etc.)&#10;- Inclua exemplos práticos quando relevante"
            maxlength="500"
          />
          <p class="text-xs text-muted-foreground mt-1">
            Mínimo 10 caracteres ({{ description.length }}/500) • Quanto mais específico, melhor o resultado
          </p>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleGenerate"
            :disabled="!isValid"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gerar Conteúdo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  isGenerating?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  isGenerating: false,
  error: null
})

const emit = defineEmits<{
  close: []
  generate: [description: string]
  retry: []
}>()

const description = ref('')

const isValid = computed(() => description.value.trim().length >= 10 && description.value.length <= 500)

const handleGenerate = () => {
  if (isValid.value) {
    emit('generate', description.value.trim())
  }
}

watch(() => props.isOpen, (open) => {
  if (!open) {
    description.value = ''
  }
})
</script>
