import { defineStore } from 'pinia'
import {
    type CollectionsCountOfALibrary,
    type Project,
    type ProjectDetails,
    type ProjectInvitation,
    type ProjectLibrary,
    type ProjectRole,
    type ProjectSettings,
} from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Notify } from 'quasar'
import { useUserStore } from '@/stores/userStore.ts'
import { ProjectStatus, Roles, Tab } from '&/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useProjectStore = defineStore('project', () => {
    const { t } = useI18n()
    const { useHandleError } = useUtils()
    const userStore = useUserStore()
    const { notify } = useComposableQuasar()

    // STATE ========================
    const project = ref<ProjectDetails>()
    const initialProject = ref<ProjectDetails>()
    const projectLoading = ref<boolean>(false)

    const tab = ref<Tab>(Tab.Positioning)

    const collectionsCount = ref<CollectionsCountOfALibrary[]>([])

    // GETTERS ========================
    const nameRequired = computed(() => project.value && project.value.name.length > 0)
    const nameLengthValid = computed(() => project.value && project.value.name.length <= 255)

    const userIsAdmin = computed(() => {
        return !!project.value?.roles.find((el) => el.role === Roles.ProjectAdmin && el.user.id === userStore.user?.id)
    })

    const userIsController = computed(() => {
        return !!project.value?.roles.find((el) => el.role === Roles.Controller && el.user.id === userStore.user?.id)
    })

    const userIsInstructorForLibrarySelected = computed((): boolean => {
        const resourceStore = useResourceStore()
        return !!project.value?.roles.find(
            (el) =>
                el.user.id === userStore.user?.id &&
                el.role === Roles.Instructor &&
                el.libraryId === resourceStore.libraryIdSelected,
        )
    })

    // ACTIONS ========================
    const getProject = async (id: string) => {
        projectLoading.value = true
        try {
            const response = await axiosI.get<ProjectDetails>(`/projects/${id}/`)

            project.value = structuredClone(response.data)
            initialProject.value = structuredClone(response.data)
            tab.value = Tab.Positioning // TODO: to move
            collectionsCount.value = [] // TODO: to move
        } catch (e) {
            useHandleError(e)
        } finally {
            projectLoading.value = false
        }
    }

    const postProject = async (): Promise<string | undefined> => {
        projectLoading.value = true
        try {
            const response = await axiosI.post<Project>('/projects/', {
                name: project.value?.name || '',
                description: project.value?.description || '',
            })

            return response.data.id
        } catch (e) {
            useHandleError(e)
        } finally {
            projectLoading.value = false
        }
    }

    const patchProjectTitleAndDescription = async () => {
        projectLoading.value = true
        try {
            const response = await axiosI.patch<Project>(`/projects/${project.value?.id}/`, {
                name: project.value?.name || '',
                description: project.value?.description || '',
            })

            if (initialProject.value) {
                initialProject.value.name = response.data.name
                initialProject.value.description = response.data.description
            }
        } catch (e) {
            useHandleError(e)
        } finally {
            projectLoading.value = false
        }
    }

    const postProjectUserRole = async (userId: string, role: Roles, libraryId?: string) => {
        try {
            const response = await axiosI.post<ProjectRole>(`/projects/${project.value?.id}/roles/`, {
                user_id: userId,
                role,
                ...(libraryId && { library_id: libraryId }),
            })
            project.value?.roles.push(response.data)
        } catch (e) {
            useHandleError(e)
        }
    }

    const deleteProjectUserRole = async (userId: string, role: Roles, libraryId?: string) => {
        try {
            await axiosI.delete(`/projects/${project.value?.id}/roles/`, {
                params: {
                    user_id: userId,
                    role,
                    ...(libraryId && { library_id: libraryId }),
                },
            })

            if (!project.value) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }

            project.value.roles = project.value.roles.filter(
                (el) => !(el.role === role && el.libraryId === (libraryId || null) && el.user.id === userId),
            )
        } catch (e) {
            useHandleError(e)
        }
    }

    const postProjectInvitation = async (email: string, role: Roles, libraryId?: string) => {
        try {
            const response = await axiosI.post<ProjectInvitation>(`/projects/${project.value?.id}/invitations/`, {
                email,
                role,
                ...(libraryId && { library_id: libraryId }),
            })

            if (!project.value) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }

            project.value.invitations.push(response.data)
        } catch (e) {
            useHandleError(e)
        }
    }

    const deleteProjectInvitation = async (email: string, role: Roles, libraryId: string | null = null) => {
        try {
            await axiosI.delete(`/projects/${project.value?.id}/invitations/`, {
                params: {
                    email,
                    role,
                    ...(libraryId && { library_id: libraryId }),
                },
            })

            if (!project.value) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }

            project.value.invitations = project.value.invitations.filter(
                (el) => !(el.role === role && el.libraryId === libraryId && el.email === email),
            )
        } catch (e) {
            useHandleError(e)
        }
    }

    const passToReview = async () => {
        try {
            const response = await axiosI.patch(`/projects/${project.value?.id}/status/`, {
                status: ProjectStatus.Review,
            })
            if (project.value) project.value.status = response.data.status
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const addExclusionReason = async (exclusionReason: string) => {
        try {
            await axiosI.post(`/projects/${project.value?.id}/exclusion_reason/`, {
                exclusion_reason: exclusionReason,
            })

            project.value?.settings.exclusionReasons.push(exclusionReason)
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const removeExclusionReason = async (exclusionReason: string) => {
        try {
            await axiosI.delete(`/projects/${project.value?.id}/exclusion_reason/`, {
                params: {
                    exclusion_reason: exclusionReason,
                },
            })

            if (project.value) {
                project.value.settings.exclusionReasons =
                    project.value.settings.exclusionReasons?.filter((reason) => reason !== exclusionReason) || []
            }
        } catch (e) {
            console.log(e)
        }
    }

    const toggleIsAlternativeStorageSite = async (library: ProjectLibrary) => {
        try {
            await axiosI.patch(`/projects/${project.value?.id}/libraries/${library.id}/`, {
                is_alternative_storage_site: !library.isAlternativeStorageSite,
            })
            const libraryToUpdate = project.value?.libraries.find((el) => el.id === library.id)
            if (libraryToUpdate) libraryToUpdate.isAlternativeStorageSite = !library.isAlternativeStorageSite
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const passToReady = async () => {
        try {
            const response = await axiosI.patch(`/projects/${project.value?.id}/status/`, {
                status: ProjectStatus.Ready,
            })
            if (project.value) project.value.status = response.data.status
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const startTheProject = async (active_after: string) => {
        try {
            await axiosI.patch<{ activeAfter: string }>(`/projects/${project.value?.id}/launch/`, {
                active_after,
            })
            if (project.value?.id) await getProject(project.value.id)
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const isRole = (role: Roles, libraryId?: string) => {
        const userStore = useUserStore()
        return (
            project.value?.roles.some(
                (el) =>
                    el.role === role &&
                    userStore.user?.id === el.user.id &&
                    ((!libraryId && role !== Roles.Instructor) || el.libraryId === libraryId),
            ) || false
        )
    }

    const fetchAlerts = async () => {
        try {
            const response = await axiosI.get<{ alerts: ProjectSettings['alerts'] }>(
                `/projects/${project.value?.id}/alerts/`,
            )
            if (project.value) project.value.settings.alerts = structuredClone(response.data.alerts)
            if (initialProject.value) initialProject.value.settings.alerts = structuredClone(response.data.alerts)
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const patchAlerts = async () => {
        try {
            const response = await axiosI.patch<{ alerts: ProjectSettings['alerts'] }>(
                `/projects/${project.value?.id}/alerts/`,
                { alerts: { ...project.value?.settings.alerts } },
            )
            if (project.value) project.value.settings.alerts = structuredClone(response.data.alerts)
            if (initialProject.value) initialProject.value.settings.alerts = structuredClone(response.data.alerts)
            Notify.create({
                type: 'positive',
                message: t('project.settings.emailAlert.successAlertUpdated'),
            })
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    return {
        // State
        project,
        initialProject,
        projectLoading,
        tab,
        collectionsCount,
        // Getters
        nameRequired,
        nameLengthValid,
        userIsAdmin,
        userIsController,
        userIsInstructorForLibrarySelected,
        // Actions
        getProject,
        postProject,
        patchProjectTitleAndDescription,
        postProjectUserRole,
        deleteProjectUserRole,
        postProjectInvitation,
        deleteProjectInvitation,
        passToReview,
        addExclusionReason,
        removeExclusionReason,
        toggleIsAlternativeStorageSite,
        passToReady,
        startTheProject,
        isRole,
        fetchAlerts,
        patchAlerts,
    }
})
