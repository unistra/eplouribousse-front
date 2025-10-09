<script lang="ts" setup>
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { ref } from 'vue'

const emit = defineEmits<{
    (e: 'delete'): void
}>()
const isLoading = ref(false)
const onDelete = () => {
    isLoading.value = true
    emit('delete')
}

defineProps<{ disable?: boolean }>()
</script>

<template>
    <QItem>
        <QItemSection>
            <slot />
        </QItemSection>
        <AtomicButton
            :disable
            icon="mdi-close"
            :loading="isLoading"
            :no-border="true"
            size="xs"
            @click="onDelete"
        />
    </QItem>
</template>
