import { type Comparator, UniqueSet } from '#/utils'
import { axiosI } from '@/plugins/axios/axios'
import { ref, watch } from 'vue'
import type { ProjectInvitation, ProjectUser } from '#/project.ts'
import type { Pagination } from '#/pagination.ts'

export type SearchUserEmitActions = {
    (e: 'addInvitation', email: string): void
    (e: 'removeInvitation', invitation: ProjectInvitation): void
    (e: 'addUser', user: ProjectUser): void
    (e: 'removeUser', user: ProjectUser): void
}

export function useSearchUser(emit: SearchUserEmitActions) {
    const username = ref<string>('')
    const users = ref<ProjectUser[]>([])
    const matchingUsers = ref<UniqueSet<ProjectUser>>()
    const userAlreadySelected = ref<ProjectUser[]>([])

    const userComparator: Comparator<ProjectUser> = (a: ProjectUser, b: ProjectUser) => a.id === b.id
    const isUserListLoading = ref<boolean>(false)
    const nextPage = ref<number | null>(1)

    watch(username, async (newValue) => {
        if (newValue === '') {
            users.value = []
            matchingUsers.value?.clear()
            nextPage.value = null
        } else {
            await fillUsers()
        }
    })

    async function fillUsers() {
        isUserListLoading.value = true

        try {
            const response = await axiosI.get<Pagination<ProjectUser>>(`/users/`, {
                params: {
                    search: username.value,
                    exclude: userAlreadySelected.value.map((user) => user.id),
                },
            })
            users.value = response.data.results
            nextPage.value = response.data.next

            if (username.value === '') {
                matchingUsers.value?.clear()
                nextPage.value = null
            } else {
                matchingUsers.value = new UniqueSet(
                    userComparator,
                    users.value.filter((user) => user.email.includes(username.value)),
                )
            }
        } finally {
            isUserListLoading.value = false
        }
    }

    async function appendUsers() {
        isUserListLoading.value = true
        try {
            const response = await axiosI.get<Pagination<ProjectUser>>(
                `/users/?exclude=${userAlreadySelected.value.map((user) => user.id).join('&exclude=')}`,
                {
                    params: {
                        page: nextPage.value,
                        search: username.value,
                    },
                },
            )
            nextPage.value = response.data.next
            users.value.push(...response.data.results)
            if (username.value === '') {
                matchingUsers.value?.clear()
                nextPage.value = null
            } else {
                matchingUsers.value = new UniqueSet(
                    userComparator,
                    users.value.filter((user) => user.email.includes(username.value)),
                )
            }
        } finally {
            isUserListLoading.value = false
        }
    }

    async function onLoad(_index: number, done: () => void) {
        if (matchingUsers.value?.size && matchingUsers.value.size() >= 10 && nextPage.value !== null) {
            isUserListLoading.value = true
            await appendUsers()
            done()
        } else {
            done()
        }
    }

    const sendAction = (
        action: 'addInvitation' | 'removeInvitation' | 'addUser' | 'removeUser',
        payload?: { invitation?: ProjectInvitation; user?: ProjectUser },
    ) => {
        if (action === 'addInvitation') emit('addInvitation', username.value)
        else if (payload?.invitation && action === 'removeInvitation') emit('removeInvitation', payload.invitation)
        else if (payload?.user && action === 'addUser') emit('addUser', payload.user)
        else if (payload?.user && action === 'removeUser') emit('removeUser', payload.user)
        username.value = ''
    }

    const clear = () => {
        matchingUsers.value?.clear()
        username.value = ''
    }

    return {
        username,
        users,
        matchingUsers,
        isUserListLoading,
        nextPage,
        userAlreadySelected,
        onLoad,
        sendAction,
        clear,
        fillUsers,
    }
}
