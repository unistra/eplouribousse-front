import { type UserI } from '#/user'
import { type Comparator, UniqueSet } from '#/utils'
import { axiosI } from '@/plugins/axios/axios'
import { ref, watch } from 'vue'
import type { ProjectInvitation, ProjectUser } from '#/project.ts'
import type { Pagination } from '#/pagination.ts'

export type SearchUserEmitActions = {
    (e: 'addInvitation', email: string): void
    (e: 'removeInvitation', invitation: ProjectInvitation): void
    (e: 'addUser', userId: string): void
    (e: 'removeUser', userId: string): void
}

export function useSearchUser(emit: SearchUserEmitActions) {
    const username = ref<string>('')
    const users = ref<UserI[]>([])
    const matchingUsers = ref<UniqueSet<UserI>>()
    const userAlreadySelected = ref<ProjectUser[]>([])

    const userComparator: Comparator<UserI> = (a: UserI, b: UserI) => a.id === b.id
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
            const response = await axiosI.get<Pagination<UserI>>(`/users/`, {
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
            const response = await axiosI.get<Pagination<UserI>>(
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
        payload?: { invitation?: ProjectInvitation; userId?: string },
    ) => {
        if (action === 'addInvitation') emit('addInvitation', username.value)
        else if (payload?.invitation && action === 'removeInvitation') emit('removeInvitation', payload.invitation)
        else if (payload?.userId && action === 'addUser') emit('addUser', payload.userId)
        else if (payload?.userId && action === 'removeUser') emit('removeUser', payload.userId)
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
