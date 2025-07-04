import { defineStore } from 'pinia'
import type { LibraryI } from '#/library'
import type { Collection, ImportCSVError, ImportCSVResponse, Project, ProjectI, Roles } from '#/project'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Notify } from 'quasar'
import i18n from '@/plugins/i18n'
import type { Pagination } from '#/pagination.ts'
import axios from 'axios'

const { t } = i18n.global

const getInitialState = (): ProjectI => ({
    id: '',
    name: '',
    description: '',
    isPrivate: false,
    activeAfter: '',
    status: 10,
    settings: [],
    invitations: [],
    roles: [],
    libraries: [],
    createdAt: '',
    updatedAt: '',
})

export const useProjectStore = defineStore('project', {
    state: (): Project => ({
        ...getInitialState(),
        initialState: getInitialState(),
        isLoading: false,
    }),
    getters: {
        nameRequired: (state) => state.name.length > 0,
        nameLengthValid: (state) => state.name.length <= 255,
    },
    actions: {
        // UTILS
        async fetchProjectById(id: string) {
            try {
                const response = await axiosI.get<ProjectI>(`/projects/${id}/`)
                this._replaceState(response.data)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknownRetry'),
                })
            }
        },
        _replaceState(data: ProjectI) {
            this.$state = {
                ...data,
                initialState: { ...data },
                isLoading: false,
            }

            if (!Array.isArray(this.invitations)) this.invitations = []
        },

        // TITLE & DESCRIPTION
        async _postNewProject() {
            try {
                const response = await axiosI.post<ProjectI>('/projects/', {
                    name: this.name,
                    description: this.description,
                    status: this.status,
                })

                this._replaceState(response.data)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async _patchTitleAndDescription() {
            try {
                const response = await axiosI.patch<ProjectI>(`/projects/${this.id}/`, {
                    name: this.name,
                    description: this.description,
                })

                this._replaceState(response.data)
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
            if (!this.libraries.some((lib) => lib.id === library.id)) {
                try {
                    await axiosI.post<ProjectI>(`/projects/${this.id}/libraries/`, {
                        library_id: library.id,
                    })
                    this.libraries.push(library)
                } catch {
                    Notify.create({
                        type: 'negative',
                        message: t('newProject.steps.libraries.errors.whileAdding'),
                    })
                    return
                }
            }
        },
        async removeLibrary(library: LibraryI) {
            if (this.libraries.some((lib) => lib.id === library.id)) {
                try {
                    await axiosI.delete<ProjectI>(`/projects/${this.id}/libraries/`, {
                        params: {
                            library_id: library.id,
                        },
                    })

                    this.libraries = this.libraries.filter((lib) => lib.id !== library.id)
                } catch {
                    Notify.create({
                        type: 'negative',
                        message: t('newProject.steps.libraries.errors.whileDeleting'),
                    })
                    return
                }
            }

            this.libraries = this.libraries.filter((lib) => lib.id !== library.id)
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
                await axiosI.post(`/projects/${this.id}/roles/`, data)

                await this.fetchProjectById(this.id) // TEMPORARY SOLUTION WAITING FOR THE ENDPOINT TO RETURN THE WELL ORGANISED OBJECT TO INSERT IN this.roles
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
                await axiosI.post(`/projects/${this.id}/invitations/`, {
                    email,
                    role,
                    ...(libraryId && { library_id: libraryId }),
                })

                await this.fetchProjectById(this.id) // TEMPORARY SOLUTION WAITING FOR THE ENDPOINT TO RETURN THE WELL ORGANISED OBJECT TO INSERT IN this.roles
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async removeInvitation(email: string, role: Roles, libraryId?: string) {
            try {
                await axiosI.delete(`/projects/${this.id}/invitations/`, {
                    params: {
                        email,
                        role,
                        ...(libraryId && { library_id: libraryId }),
                    },
                })
                this.invitations = this.invitations.filter(
                    (el) => !(el.role === 'instructor' && el.libraryId === libraryId && el.email === email),
                )
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
    },
})
