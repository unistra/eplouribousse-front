<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { onMounted } from 'vue'
import type { ProjectDetails } from '#/project.ts'

const { t } = useI18n()
const projectStore = useProjectStore()

onMounted(() => {
    // Create project in store to ensure display
    if (!projectStore.project) {
        projectStore.project = {
            name: '',
            description: '',
        } as ProjectDetails
    }
})
</script>

<template>
    <div v-if="projectStore.project">
        <h1>{{ t('views.project.new.stepper.steps.informations.title') }}</h1>
        <QForm>
            <AtomicInput
                v-model="projectStore.project.name"
                :label="t('views.project.new.stepper.steps.informations.name')"
                required
                :rules="[
                    () => projectStore.nameRequired || t('errors.form.fieldIsRequired'),
                    () => projectStore.nameLengthValid || t('errors.form.fieldLessThan255'),
                ]"
                type="text"
            />
            <AtomicInput
                v-model="projectStore.project.description"
                :label="t('views.project.new.stepper.steps.informations.description')"
                type="textarea"
            />
        </QForm>
    </div>
</template>

<style lang="sass" scoped>
div
    display: flex
    flex-direction: column
    gap: 2rem

    h1
        font-size: var(--font-size-xl)
</style>
