<script lang="ts" setup>
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { ref } from 'vue'

defineProps<{
    allowDeleting?: boolean
}>()
const emit = defineEmits<{
    (e: 'delete'): void
}>()
const isLoading = ref(false)
const onDelete = () => {
    isLoading.value = true
    emit('delete')
}
</script>

<template>
    <QItem>
        <QItemSection>
            <slot />
        </QItemSection>
        <AtomicButton
            v-if="allowDeleting"
            icon="mdi-close"
            :loading="isLoading"
            :no-border="true"
            size="xs"
            @click="onDelete"
        />
    </QItem>
</template>
