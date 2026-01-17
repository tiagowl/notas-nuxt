<template>
  <nav v-if="items.length > 0" class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
    <template v-for="(item, index) in items" :key="item.path">
      <NuxtLink 
        :to="item.path"
        class="hover:text-foreground transition-colors"
        :class="{ 'font-medium text-foreground': index === items.length - 1 }"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-if="index < items.length - 1" class="mx-2">/</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  path: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>
