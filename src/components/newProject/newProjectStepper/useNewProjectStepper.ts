import { computed, ref, useTemplateRef } from 'vue'
import { QStepper } from 'quasar'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useNewProjectStepper = () => {
    const { t } = useI18n()
    const store = useProjectStore()
    const { notify } = useComposableQuasar()

    const step = ref(1)
    const stepper = useTemplateRef<QStepper>('stepper')

    const buttonLabel = computed(() => {
        switch (step.value) {
            case 1:
                if (!store.id) {
                    return t('newProject.buttons.create')
                } else if (
                    store.id &&
                    (store.name !== store.initialState.name || store.description !== store.initialState.description)
                ) {
                    return t('newProject.buttons.modify')
                } else {
                    return t('newProject.buttons.continue')
                }
            case 3:
                return t('newProject.buttons.continue')
            default:
                return t('newProject.buttons.continue')
        }
    })

    const nextStep = async () => {
        if (!stepper.value) throw new Error()

        switch (step.value) {
            case 1:
                const isValid = await store.validateAndProceedTitleAndDescription()
                if (isValid) {
                    stepper.value.next()
                } else {
                    notify({
                        type: 'negative',
                        message: t('errors.unknown'),
                    })
                }
                break
            case 2:
                stepper.value.next()
                break
            case 3:
                stepper.value.next()
                break
        }
    }

    const previousStep = () => {
        if (!stepper.value) throw new Error()

        if (step.value > 1) {
            step.value--
        }

        stepper.value.previous()
    }

    return {
        step,
        stepper,
        buttonLabel,
        nextStep,
        previousStep,
    }
}
