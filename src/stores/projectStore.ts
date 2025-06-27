import { defineStore } from 'pinia'
import type { LibraryI } from '#/library'
import type { Project, ProjectI, Roles } from '#/project'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Notify } from 'quasar'
import i18n from '@/plugins/i18n'

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
            }
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
                    const response = await axiosI.post<ProjectI>(`/projects/${this.id}/libraries/`, {
                        library_id: library.id,
                    })

                    this._replaceState(response.data) // THIS WILL BE UPDATED, THE RESPONSE WILL ONLY BE THE LIBRARY ADDED
                    // this.libraries.push(response.data) // THIS LINE WILL BE NECESSARY WHEN UPDATED
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
        async addInstructor(user_id: string, library_id: string) {
            try {
                await axiosI.post(`/projects/${this.id}/roles/`, {
                    user_id: user_id,
                    role: 'instructor',
                    library_id,
                })

                await this.fetchProjectById(this.id) // TEMPORARY SOLUTION WAITING FOR THE ENDPOINT TO RETURN THE WELL ORGANISED OBJECT TO INSERT IN this.roles
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async removeInstructor(user_id: string, library_id: string) {
            try {
                await axiosI.delete(`/projects/${this.id}/roles/`, {
                    params: {
                        user_id,
                        role: 'instructor',
                        library_id,
                    },
                })

                this.roles = this.roles.filter(
                    (el) => !(el.role === 'instructor' && el.library === library_id && el.user.id === user_id),
                )
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },

        async addInvitation(email: string, role: Roles, library_id?: string) {
            try {
                await axiosI.post(`/projects/${this.id}/invitations/`, {
                    email,
                    role,
                    library: library_id,
                })

                await this.fetchProjectById(this.id) // TEMPORARY SOLUTION WAITING FOR THE ENDPOINT TO RETURN THE WELL ORGANISED OBJECT TO INSERT IN this.roles
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async removeInvitation(email: string, role: Roles, library_id?: string) {
            try {
                await axiosI.delete(`/projects/${this.id}/invitations/`, {
                    params: {
                        email,
                        role,
                        library: library_id,
                    },
                })
                this.invitations = this.invitations.filter(
                    (el) => !(el.role === 'instructor' && el.library === library_id && el.email === email),
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
