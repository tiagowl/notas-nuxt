<template>
  <div class="border rounded-lg">
    <div v-if="editor" class="border-b p-2 flex gap-1 flex-wrap">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-accent': editor.isActive('bold') }"
        class="p-2 hover:bg-accent rounded"
        type="button"
        aria-label="Negrito"
      >
        <strong>B</strong>
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-accent': editor.isActive('italic') }"
        class="p-2 hover:bg-accent rounded"
        type="button"
        aria-label="Itálico"
      >
        <em>I</em>
      </button>
      <div class="w-px bg-border mx-1" />
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-accent': editor.isActive('heading', { level: 1 }) }"
        class="p-2 hover:bg-accent rounded"
        type="button"
        aria-label="Título 1"
      >
        H1
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-accent': editor.isActive('heading', { level: 2 }) }"
        class="p-2 hover:bg-accent rounded"
        type="button"
        aria-label="Título 2"
      >
        H2
      </button>
      <div class="w-px bg-border mx-1" />
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-accent': editor.isActive('bulletList') }"
        class="p-2 hover:bg-accent rounded"
        type="button"
        aria-label="Lista"
      >
        •
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-accent': editor.isActive('orderedList') }"
        class="p-2 hover:bg-accent rounded"
        type="button"
        aria-label="Lista numerada"
      >
        1.
      </button>
    </div>
    <div class="p-4 min-h-[200px]">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none'
    }
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== undefined && newValue !== null) {
    const currentHtml = editor.value.getHTML()
    const newValueStr = newValue || '<p></p>'
    
    // Sempre atualizar se o valor mudou (comparação estrita)
    // O false no setContent evita trigger do onUpdate durante a atualização
    if (currentHtml !== newValueStr) {
      // Usar setContent com emitUpdate: false para evitar loops
      editor.value.commands.setContent(newValueStr, false, { emitUpdate: false })
    }
  }
}, { immediate: true, deep: false, flush: 'post' })

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.ProseMirror {
  outline: none;
}

.ProseMirror p {
  margin: 0.5em 0;
}

.ProseMirror h1 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5em 0;
}

.ProseMirror h2 {
  font-size: 1.25em;
  font-weight: bold;
  margin: 0.5em 0;
}

.ProseMirror ul,
.ProseMirror ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.ProseMirror li {
  margin: 0.25em 0;
}
</style>
