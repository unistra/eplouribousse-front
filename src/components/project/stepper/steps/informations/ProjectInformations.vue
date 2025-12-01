<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()
const projectStore = useProjectStore()
</script>

<template>
    <div>
        <h1>{{ t('view.project.new.stepper.steps.informations.title') }}</h1>
        <QForm>
            <AtomicInput
                v-model="projectStore.name"
                :label="t('view.project.new.stepper.steps.informations.name')"
                required
                :rules="[
                    () => projectStore.nameRequired || t('forms.validation.fieldIsRequired'),
                    () => projectStore.nameLengthValid || t('forms.validation.fieldLessThan255'),
                ]"
                type="text"
            />
            <AtomicInput
                v-model="projectStore.description"
                :label="t('view.project.new.stepper.steps.informations.description')"
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
