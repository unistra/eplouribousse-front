<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/projectStore.ts'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import { computed, onMounted, ref } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import type { Project, ProjectSettings } from '#/project.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

const { t } = useI18n()
const { useHandleError } = useUtils()
const { notify } = useComposableQuasar()
const projectStore = useProjectStore()
const loading = ref<boolean>(false)
const saveLoading = ref<boolean>(false)

onMounted(async () => {
    loading.value = true
    try {
        const response = await axiosI.get<{ alerts: ProjectSettings['alerts'] }>(
            `/projects/${projectStore.project?.id}/alerts/`,
        )
        if (!projectStore.project || !projectStore.initialProject) {
            notify({
                message: t('errors.dataUnreachable'),
                color: 'negative',
            })
            return
        }

        projectStore.project.settings.alerts = structuredClone(response.data.alerts)
        projectStore.initialProject.settings.alerts = structuredClone(response.data.alerts)
    } catch (e) {
        useHandleError(e)
    } finally {
        loading.value = false
    }
})
const isDifferenceBetweenSettingsAndInitial = computed(() => {
    if (!projectStore.project) return false

    const entries = Object.entries(projectStore.project.settings.alerts) as [
        keyof Project['settings']['alerts'],
        boolean,
    ][]
    return !entries.every(([key, value]) => projectStore.initialProject?.settings.alerts[key] === value)
})
const patchProjectAlerts = async () => {
    saveLoading.value = false
    if (!isDifferenceBetweenSettingsAndInitial.value) return
    try {
        const response = await axiosI.patch<{ alerts: ProjectSettings['alerts'] }>(
            `/projects/${projectStore.project?.id}/alerts/`,
            { alerts: { ...projectStore.project?.settings.alerts } },
        )
        if (projectStore.project) projectStore.project.settings.alerts = structuredClone(response.data.alerts)
        if (projectStore.initialProject)
            projectStore.initialProject.settings.alerts = structuredClone(response.data.alerts)
        notify({
            type: 'positive',
            message: t('project.settings.emailAlert.successAlertUpdated'),
        })
    } catch (e) {
        useHandleError(e)
    }
    saveLoading.value = false
}
</script>

<template>
    <QList
        v-if="projectStore.project"
        denses
    >
        <template
            v-for="key in Object.keys(projectStore.project.settings.alerts)"
            :key="key"
        >
            <QItem
                v-if="key !== 'preservation' && key !== 'transfer'"
                dense
            >
                <AtomicToggle
                    v-model="projectStore.project.settings.alerts[key as keyof Project['settings']['alerts']]"
                    :disable="!projectStore.userIsAdmin"
                    :label="t(`project.settings.emailAlert.${key}`)"
                />
            </QItem>
        </template>
    </QList>
    <AtomicButton
        v-if="isDifferenceBetweenSettingsAndInitial"
        :label="t('common.save')"
        :loading="saveLoading"
        @click="patchProjectAlerts"
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
