import { computed, ref, useTemplateRef } from 'vue'
import { QStepper } from 'quasar'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import router from '@/router'
import { Roles } from '&/project.ts'
import { useProjectLibraryCollection } from '@/components/project/libraries/card/collectionField/useProjectLibraryCollection.ts'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projectsStore.ts'

export const checkValidityProjectStepper = () => {
    const projectStore = useProjectStore()
    const { csvImportLoading } = useProjectLibraryCollection()
    const checkValidityForLibraryStep = computed<boolean | 'pending'>(() => {
        if (!projectStore.project) return false
        if (!(projectStore.project.libraries.length >= 2)) return false
        if (csvImportLoading.value.length) return 'pending'

        return projectStore.project.libraries.every((library) => {
            if (!projectStore.project) return false
            const hasInstructorOrInstructorInvite =
                projectStore.project.roles.some(
                    (role) => role.libraryId === library.id && role.role === Roles.Instructor,
                ) ||
                projectStore.project.invitations.some(
                    (invitation) => invitation.role === Roles.Instructor && invitation.libraryId === library.id,
                )
            const hasCollection = projectStore.collectionsCount.some((el) => el.libraryId === library.id)

            if (!hasCollection) return csvImportLoading.value
            return hasInstructorOrInstructorInvite
        })
    })

    const checkValidityForRolesStep = computed(() => {
        const requiredRoles = [Roles.ProjectManager, Roles.ProjectAdmin, Roles.Controller]
        return requiredRoles.every((required) => {
            if (!projectStore.project) return false
            return (
                projectStore.project.roles.some((role) => role.role === required) ||
                projectStore.project.invitations.some((invitation) => invitation.role === required)
            )
        })
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
            if (!projectStore.project || !projectStore.initialProject) return t('newProject.buttons.create')
            if (
                projectStore.project.id &&
                (projectStore.project.name !== projectStore.initialProject.name ||
                    projectStore.project.description !== projectStore.initialProject.description)
            )
                return t('newProject.buttons.modify')
        }
        return t('common.continue')
    })

    const nextStep = async () => {
        if (!stepper.value) {
            notify({
                message: t('errors.unknownRetry'),
                color: 'negative',
            })
            return
        }

        if (step.value === 1) {
            if (!projectStore.nameRequired || !projectStore.nameLengthValid) return
            let newProjectId: string | undefined

            if (!projectStore.project?.id) {
                newProjectId = await projectStore.postProject()
            } else if (
                projectStore.project.name !== projectStore.initialProject?.name ||
                projectStore.project.description !== projectStore.initialProject.description
            ) {
                await projectStore.patchProjectTitleAndDescription()
            }

            if (route.name === 'newProject') {
                if (!newProjectId) {
                    notify({
                        message: t('errors.dataUnreachable'),
                        color: 'negative',
                    })

                    return
                }

                const projectsStore = useProjectsStore()
                await projectsStore.getUserProjects()
                await router.push({
                    name: 'project',
                    params: { id: newProjectId },
                    query: { page: 2 },
                })
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
