import { computed, ref, useTemplateRef } from 'vue'
import { QStepper } from 'quasar'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import router from '@/router/index'
import { useUserStore } from '@/stores/userStore.ts'

export const useNewProjectStepper = () => {
    const { t } = useI18n()
    const store = useProjectStore()
    const { notify } = useComposableQuasar()

    const step = ref(1)
    const stepper = useTemplateRef<QStepper>('stepper')

    const passToReviewLoading = ref<boolean>(false)
    const passToReview = async () => {
        passToReviewLoading.value = true
        await store.passToReview()
        passToReviewLoading.value = false
    }

    const buttonLabel = computed(() => {
        if (step.value === 1) {
            if (!store.id) return t('newProject.buttons.create')
            if (
                store.id &&
                (store.name !== store.initialState.name || store.description !== store.initialState.description)
            )
                return t('newProject.buttons.modify')
        }
        return t('newProject.buttons.continue')
    })

    const nextStep = async () => {
        if (!stepper.value) throw new Error()

        switch (step.value) {
            case 1:
                const isValid = await store.validateAndProceedTitleAndDescription()
                if (isValid) {
                    if (router.currentRoute.value.name === 'newProject') {
                        const userStore = useUserStore()
                        await userStore.getProjects()
                        await router.push({ name: 'project', params: { id: store.id }, query: { page: 2 } })
                        return
                    }

                    stepper.value.next()
                } else {
                    notify({
                        type: 'negative',
                        message: t('errors.unknown'),
                    })
                }
                break
            default:
                stepper.value.next()
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
        passToReview,
        passToReviewLoading,
    }
}
