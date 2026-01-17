<template>
  <div class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium mb-2">
        Título da Nota
      </label>
      <input
        id="title"
        v-model="title"
        type="text"
        placeholder="Digite o título..."
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        :class="{ 'border-destructive': titleError }"
        maxlength="255"
      />
      <p v-if="titleError" class="text-sm text-destructive mt-1">{{ titleError }}</p>
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-2">
        Conteúdo
      </label>
      <RichTextEditor v-model="content" />
    </div>
    
    <div>
      <button
        @click="$emit('generate-ai')"
        class="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center gap-2"
      >
        ✨ Gerar com IA
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from './RichTextEditor.vue'

interface Props {
  initialTitle?: string
  initialContent?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialTitle: '',
  initialContent: ''
})

const emit = defineEmits<{
  'update:title': [value: string]
  'update:content': [value: string]
  'generate-ai': []
}>()

const title = ref(props.initialTitle)
const content = ref(props.initialContent)
const titleError = ref<string | null>(null)

watch(title, (newTitle) => {
  emit('update:title', newTitle)
  if (titleError.value) {
    titleError.value = null
  }
})

watch(content, (newContent) => {
  emit('update:content', newContent)
})

defineExpose({
  validate: () => {
    if (!title.value.trim()) {
      titleError.value = 'Título é obrigatório'
      return false
    }
    return true
  },
  getData: () => ({
    title: title.value.trim(),
    content: content.value
  })
})
</script>
