<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import { onMounted, ref } from 'vue'

const props = defineProps<{
    resourceId: string
}>()

const resourceStore = useResourceStore()
const loading = ref<boolean>(false)
onMounted(async () => {
    loading.value = true
    await resourceStore.fetchResourceAndCollections(props.resourceId)
    loading.value = false
})
</script>

<template>
    <div
        v-if="loading"
        class="spinner"
    >
        <QSpinner size="2rem" />
    </div>
    <p>aa</p>
    <p>{{ resourceStore.status }}</p>
</template>

<style scoped lang="sass">
.spinner
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 1
</style>
