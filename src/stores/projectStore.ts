import { defineStore } from 'pinia'
import type { LibraryI } from '#/library'
import {
    type Collection,
    type ImportCSVError,
    type ImportCSVResponse,
    type Project,
    type ProjectI,
    type ProjectInvitation,
    type ProjectLibrary,
    type ProjectRole,
    type ProjectSettings,
} from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Notify } from 'quasar'
import i18n from '@/plugins/i18n'
import type { Pagination } from '#/pagination.ts'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore.ts'
import { ProjectStatus, Roles, Tab } from '&/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'

const { t } = i18n.global

const initialState: ProjectI = {
    id: '',
    name: '',
    description: '',
    isPrivate: false,
    activeAfter: '',
    isActive: false,
    status: ProjectStatus.Draft,
    createdBy: {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        displayName: '',
    },
    settings: {
        exclusionReasons: [],
        alerts: {
            positioning: false,
            arbitration: false,
            instruction: false,
            control: false,
            edition: false,
            preservation: false,
            transfer: false,
        },
        projectCreator: '',
    },
    invitations: [],
    roles: [],
    libraries: [],
    createdAt: '',
    updatedAt: '',
    acl: {
        destroy: false,
        update: false,
        partialUpdate: false,
        retrieve: false,
        addLibrary: false,
        updateStatus: false,
        exclusionReason: false,
        removeExclusionReason: false,
        status: false,
    },
}

export const useProjectStore = defineStore('project', {
    state: (): Project => ({
        ...structuredClone(initialState),
        initialState: structuredClone(initialState),
        isLoading: false,
        isInEditionMode: false,
        tab: Tab.Positioning,
        librariesIdThatHaveACollectionImported: [],
    }),
    getters: {
        nameRequired: (state) => state.name.length > 0,
        nameLengthValid: (state) => state.name.length <= 255,
        userIsAdmin: (state) => {
            const userStore = useUserStore()
            return !!state.roles.find((el) => el.role === Roles.ProjectAdmin && el.user.id === userStore.user?.id)
        },
        userIsController: (state) => {
            const userStore = useUserStore()
            return !!state.roles.find((el) => el.role === Roles.Controller && el.user.id === userStore.user?.id)
        },
        userIsInstructorForLibrarySelected(state) {
            const userStore = useUserStore()
            const resourceStore = useResourceStore()
            return !!state.roles.find(
                (el) =>
                    el.user.id === userStore.user?.id &&
                    el.role === Roles.Instructor &&
                    el.libraryId === resourceStore.libraryIdSelected,
            )
        },
    },
    actions: {
        // UTILS
        async fetchProjectById(id: string, edition?: boolean) {
            try {
                const response = await axiosI.get<ProjectI>(`/projects/${id}/`)

                this.$state = {
                    ...structuredClone(response.data),
                    initialState: structuredClone(response.data),
                    isLoading: false,
                    isInEditionMode: !!edition,
                    tab: Tab.Positioning,
                    librariesIdThatHaveACollectionImported: [],
                }
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknownRetry'),
                })
            }
        },

        // TITLE & DESCRIPTION
        async _postNewProject() {
            this.isLoading = true
            try {
                const response = await axiosI.post<ProjectI>('/projects/', {
                    name: this.name,
                    description: this.description,
                })

                this.id = response.data.id
                this.initialState.id = response.data.id
                this.initialState.name = this.name
                this.initialState.description = this.description
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            } finally {
                this.isLoading = false
            }
        },
        async _patchTitleAndDescription() {
            try {
                await axiosI.patch(`/projects/${this.id}/`, {
                    name: this.name,
                    description: this.description,
                })

                this.initialState.name = this.name
                this.initialState.description = this.description
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async validateAndProceedTitleAndDescription(): Promise<boolean> {
            if (!this.nameRequired || !this.nameLengthValid) return false

            if (!this.id) {
                await this._postNewProject()
            } else if (this.name !== this.initialState.name || this.description !== this.initialState.description) {
                await this._patchTitleAndDescription()
            }

            return true
        },

        // LIBRARIES
        async addLibrary(library: LibraryI) {
            if (this.libraries.some((lib) => lib.id === library.id)) return
            try {
                await axiosI.post(`/projects/${this.id}/libraries/`, { library_id: library.id })

                const newLibrary: ProjectLibrary = { ...library, isAlternativeStorageSite: false }
                this.libraries.push(newLibrary)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('newProject.steps.libraries.errors.whileAdding'),
                })
                return
            }
        },
        async removeLibrary(library: LibraryI) {
            if (!this.libraries.some((lib) => lib.id === library.id)) return
            try {
                await axiosI.delete<ProjectI>(`/projects/${this.id}/libraries/`, {
                    params: {
                        library_id: library.id,
                    },
                })

                this.libraries = this.libraries.filter((lib) => lib.id !== library.id)
                this.roles = this.roles.filter((role) => role.libraryId !== library.id)
                this.invitations = this.invitations.filter((inv) => inv.libraryId !== library.id)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('newProject.steps.libraries.errors.whileDeleting'),
                })
                return
            }
        },
        async addRole(userId: string, role: Roles, libraryId?: string) {
            const data: {
                user_id: string
                role: Roles
                library_id?: string
            } = {
                user_id: userId,
                role,
                ...(libraryId && { library_id: libraryId }),
            }
            try {
                const response = await axiosI.post<ProjectRole>(`/projects/${this.id}/roles/`, data)
                this.roles.push(response.data)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async removeRole(userId: string, role: Roles, libraryId?: string) {
            const data: {
                user_id: string
                role: Roles
                library_id?: string
            } = {
                user_id: userId,
                role,
                ...(libraryId && { library_id: libraryId }),
            }
            try {
                await axiosI.delete(`/projects/${this.id}/roles/`, {
                    params: data,
                })
                this.roles = this.roles.filter(
                    (el) => !(el.role === role && el.libraryId === (libraryId || null) && el.user.id === userId),
                )
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async getCollection(libraryId: string): Promise<Pagination<Collection> | undefined> {
            try {
                const response = await axiosI.get<Pagination<Collection>>('/collections/', {
                    params: {
                        library: libraryId,
                        project: this.id,
                    },
                })

                if (!this.librariesIdThatHaveACollectionImported.includes(libraryId) && response.data.count)
                    this.librariesIdThatHaveACollectionImported.push(libraryId)
                return response.data
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async importCollection(file: File, libraryId: string): Promise<ImportCSVResponse | ImportCSVError> {
            const formData = new FormData()
            formData.append('csv_file', file)
            formData.append('library', libraryId)
            formData.append('project', this.id)

            try {
                const response = await axiosI.post<ImportCSVResponse>('/collections/import-csv/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                return response.data
            } catch (e: unknown) {
                if (axios.isAxiosError(e)) {
                    return e.response?.data.csvFile as ImportCSVError
                } else {
                    throw new Error()
                }
            }
        },
        async deleteCollection(libraryId: string): Promise<void> {
            console.log('Todo', libraryId)
        },
        async addInvitation(email: string, role: Roles, libraryId?: string) {
            try {
                const response = await axiosI.post<ProjectInvitation>(`/projects/${this.id}/invitations/`, {
                    email,
                    role,
                    ...(libraryId && { library_id: libraryId }),
                })
                this.invitations.push(response.data)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async removeInvitation(email: string, role: Roles, libraryId: string | null = null) {
            try {
                await axiosI.delete(`/projects/${this.id}/invitations/`, {
                    params: {
                        email,
                        role,
                        ...(libraryId && { library_id: libraryId }),
                    },
                })
                this.invitations = this.invitations.filter(
                    (el) => !(el.role === role && el.libraryId === libraryId && el.email === email),
                )
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async passToReview() {
            try {
                const response = await axiosI.patch(`/projects/${this.id}/status/`, {
                    status: ProjectStatus.Review,
                })
                this.status = response.data.status
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async addExclusionReason(exclusionReason: string) {
            try {
                await axiosI.post(`/projects/${this.id}/exclusion_reason/`, {
                    exclusion_reason: exclusionReason,
                })

                this.settings.exclusionReasons.push(exclusionReason)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async removeExclusionReason(exclusionReason: string) {
            try {
                await axiosI.delete(`/projects/${this.id}/exclusion_reason/`, {
                    params: {
                        exclusion_reason: exclusionReason,
                    },
                })

                this.settings.exclusionReasons =
                    this.settings.exclusionReasons?.filter((reason) => reason !== exclusionReason) || []
            } catch (e) {
                console.log(e)
            }
        },

        async toggleIsAlternativeStorageSite(library: ProjectLibrary) {
            try {
                await axiosI.patch(`/projects/${this.id}/libraries/${library.id}/`, {
                    is_alternative_storage_site: !library.isAlternativeStorageSite,
                })
                const libraryToUpdate = this.libraries.find((el) => el.id === library.id)
                if (libraryToUpdate) libraryToUpdate.isAlternativeStorageSite = !library.isAlternativeStorageSite
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async passToReady() {
            try {
                const response = await axiosI.patch(`/projects/${this.id}/status/`, {
                    status: ProjectStatus.Ready,
                })
                this.status = response.data.status
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async startTheProject(active_after: string) {
            try {
                await axiosI.patch<{ activeAfter: string }>(`/projects/${this.id}/launch/`, {
                    active_after,
                })
                await this.fetchProjectById(this.id)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        isRole(role: Roles, libraryId?: string) {
            const userStore = useUserStore()
            return this.roles.some(
                (el) =>
                    el.role === role &&
                    userStore.user?.id === el.user.id &&
                    ((!libraryId && role !== Roles.Instructor) || el.libraryId === libraryId),
            )
        },
        findUsersByRole(role: Roles) {
            return this.roles.filter((projectUser) => projectUser.role === role)
        },
        async fetchAlerts() {
            try {
                const response = await axiosI.get<{ alerts: ProjectSettings['alerts'] }>(`/projects/${this.id}/alerts/`)
                this.settings.alerts = structuredClone(response.data.alerts)
                this.initialState.settings.alerts = structuredClone(response.data.alerts)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async patchAlerts() {
            try {
                const response = await axiosI.patch<{ alerts: ProjectSettings['alerts'] }>(
                    `/projects/${this.id}/alerts/`,
                    { alerts: { ...this.settings.alerts } },
                )
                this.settings.alerts = structuredClone(response.data.alerts)
                this.initialState.settings.alerts = structuredClone(response.data.alerts)
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
        },
    },
})
