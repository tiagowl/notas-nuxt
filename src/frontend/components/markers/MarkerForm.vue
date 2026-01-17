<template>
  <div class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium mb-2">
        Nome do marcador
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        :placeholder="placeholder"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        :class="{ 'border-destructive': error }"
        maxlength="255"
      />
      <p v-if="error" class="text-sm text-destructive mt-1">{{ error }}</p>
    </div>
    <div class="flex justify-end gap-2">
      <button
        @click="$emit('cancel')"
        class="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
      >
        Cancelar
      </button>
      <button
        @click="handleSubmit"
        :disabled="!isValid || isSubmitting"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Salvando...' : submitLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  initialValue?: string
  placeholder?: string
  submitLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Digite o nome do marcador...',
  submitLabel: 'Criar Marcador'
})

const emit = defineEmits<{
  submit: [name: string]
  cancel: []
}>()

const name = ref(props.initialValue || '')
const error = ref<string | null>(null)
const isSubmitting = ref(false)

const isValid = computed(() => name.value.trim().length > 0 && name.value.length <= 255)

const handleSubmit = () => {
  if (!isValid.value || isSubmitting.value) return
  
  const trimmedName = name.value.trim()
  
  if (trimmedName.length === 0) {
    error.value = 'Nome é obrigatório'
    return
  }
  
  if (trimmedName.length > 255) {
    error.value = 'Nome muito longo (máximo 255 caracteres)'
    return
  }
  
  error.value = null
  isSubmitting.value = true
  emit('submit', trimmedName)
}

watch(name, () => {
  if (error.value) {
    error.value = null
  }
})
</script>
