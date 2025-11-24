<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/projectStore.ts'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import { computed, onMounted, ref } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const projectStore = useProjectStore()
const loading = ref<boolean>(false)
const saveLoading = ref<boolean>(false)
onMounted(async () => {
    loading.value = true
    await projectStore.fetchAlerts()
    loading.value = false
})
const isDifferenceBetweenSettingsAndInitial = computed(() => {
    return !Object.entries(projectStore.settings.alerts).every(
        ([key, value]) =>
            projectStore.initialState.settings.alerts[key as keyof typeof projectStore.initialState.settings.alerts] ===
            value,
    )
})
const onPatchAlerts = async () => {
    saveLoading.value = false
    if (!isDifferenceBetweenSettingsAndInitial.value) return
    await projectStore.patchAlerts()
    saveLoading.value = false
}
</script>

<template>
    <QList denses>
        <template
            v-for="key in Object.keys(projectStore.settings.alerts)"
            :key="key"
        >
            <QItem
                v-if="key !== 'preservation' && key !== 'transfer'"
                dense
            >
                <AtomicToggle
                    v-model="
                        //@ts-ignore
                        projectStore.settings.alerts[key as keyof typeof projectStore.settings.alerts]
                    "
                    :label="t(`project.settings.emailAlert.${key}`)"
                />
            </QItem>
        </template>
    </QList>
    <AtomicButton
        v-if="isDifferenceBetweenSettingsAndInitial"
        :label="t('common.save')"
        :loading="saveLoading"
        @click="onPatchAlerts"
    />
</template>

<style scoped lang="sass">
.q-card
    display: flex
    flex-direction: column

    .spinner
        justify-self: center
        align-self: center
</style>
