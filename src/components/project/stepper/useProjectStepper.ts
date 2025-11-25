import { computed, ref, useTemplateRef } from 'vue'
import { QStepper } from 'quasar'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import router from '@/router'
import { useUserStore } from '@/stores/userStore.ts'
import { Roles } from '&/project.ts'
import { useProjectLibraryCollection } from '@/components/project/libraries/card/collectionField/useProjectLibraryCollection.ts'
import { useRoute } from 'vue-router'

export const checkValidityProjectStepper = () => {
    const projectStore = useProjectStore()
    const { csvImportLoading } = useProjectLibraryCollection()
    const checkValidityForLibraryStep = computed<boolean | 'pending'>(() => {
        if (!(projectStore.libraries.length >= 2)) return false
        if (csvImportLoading.value.length) return 'pending'

        return projectStore.libraries.every((library) => {
            const hasInstructorOrInstructorInvite =
                projectStore.roles.some((role) => role.libraryId === library.id && role.role === Roles.Instructor) ||
                projectStore.invitations.some(
                    (invitation) => invitation.role === Roles.Instructor && invitation.libraryId === library.id,
                )
            const hasCollection = projectStore.collectionsCount.some((el) => el.libraryId === library.id)

            if (!hasCollection) return csvImportLoading.value
            return hasInstructorOrInstructorInvite
        })
    })

    const checkValidityForRolesStep = computed(() => {
        const requiredRoles = [Roles.ProjectManager, Roles.ProjectAdmin, Roles.Controller]
        return requiredRoles.every(
            (required) =>
                projectStore.roles.some((role) => role.role === required) ||
                projectStore.invitations.some((invitation) => invitation.role === required),
        )
    })

    return {
        checkValidityForLibraryStep,
        checkValidityForRolesStep,
    }
}
export const useProjectStepper = () => {
    const { t } = useI18n()
    const projectStore = useProjectStore()
    const { notify } = useComposableQuasar()
    const route = useRoute()

    const step = ref(1)
    const stepper = useTemplateRef<QStepper>('stepper')
    const passToReviewLoading = ref<boolean>(false)
    const passToReview = async () => {
        passToReviewLoading.value = true
        await projectStore.passToReview()
        passToReviewLoading.value = false
    }

    const buttonLabel = computed(() => {
        if (step.value === 1) {
            if (!projectStore.id) return t('newProject.buttons.create')
            if (
                projectStore.id &&
                (projectStore.name !== projectStore.initialState.name ||
                    projectStore.description !== projectStore.initialState.description)
            )
                return t('newProject.buttons.modify')
        }
        return t('common.continue')
    })

    const nextStep = async () => {
        if (!stepper.value) throw new Error()

        if (step.value === 1) {
            if (!(await projectStore.validateAndProceedTitleAndDescription())) {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
                return
            }
            if (route.name === 'newProject') {
                const userStore = useUserStore()
                await userStore.getProjects()
                await projectStore.fetchProjectById(projectStore.id)
                await router.push({ name: 'project', params: { id: projectStore.id }, query: { page: 2 } })
                return
            }
        }

        stepper.value.next()
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
