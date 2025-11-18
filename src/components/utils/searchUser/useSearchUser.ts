import { type Comparator, UniqueSet } from '#/utils'
import { axiosI } from '@/plugins/axios/axios'
import { ref, watch } from 'vue'
import type { ProjectInvitation } from '#/project.ts'
import type { Pagination } from '#/pagination.ts'
import type { UserSummarized } from '#/user.ts'

export type SearchUserEmitActions = {
    (e: 'addInvitation', email: string): void
    (e: 'removeInvitation', invitation: ProjectInvitation): void
    (e: 'addUser', user: UserSummarized): void
    (e: 'removeUser', user: UserSummarized): void
}

export function useSearchUser(emit: SearchUserEmitActions) {
    const input = ref<string>('')
    const users = ref<UserSummarized[]>([])
    const matchingUsers = ref<UniqueSet<UserSummarized>>()
    const userAlreadySelected = ref<UserSummarized[]>([])

    const userComparator: Comparator<UserSummarized> = (a: UserSummarized, b: UserSummarized) => a.id === b.id
    const isUserListLoading = ref<boolean>(false)
    const nextPage = ref<number | null>(1)

    watch(input, async (newValue) => {
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
            const response = await axiosI.get<Pagination<UserSummarized>>(`/users/`, {
                params: {
                    search: input.value,
                    exclude: userAlreadySelected.value.map((user) => user.id),
                },
            })
            users.value = response.data.results
            nextPage.value = response.data.next

            if (input.value === '') {
                matchingUsers.value?.clear()
                nextPage.value = null
            } else {
                matchingUsers.value = new UniqueSet(
                    userComparator,
                    users.value.filter((user) => user.email.includes(input.value)),
                )
            }
        } finally {
            isUserListLoading.value = false
        }
    }

    async function appendUsers() {
        isUserListLoading.value = true
        try {
            const response = await axiosI.get<Pagination<UserSummarized>>(
                `/users/?exclude=${userAlreadySelected.value.map((user) => user.id).join('&exclude=')}`,
                {
                    params: {
                        page: nextPage.value,
                        search: input.value,
                    },
                },
            )
            nextPage.value = response.data.next
            users.value.push(...response.data.results)
            if (input.value === '') {
                matchingUsers.value?.clear()
                nextPage.value = null
            } else {
                matchingUsers.value = new UniqueSet(
                    userComparator,
                    users.value.filter((user) => user.email.includes(input.value)),
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
        payload?: { invitation?: ProjectInvitation; user?: UserSummarized },
    ) => {
        if (action === 'addInvitation') emit('addInvitation', input.value)
        else if (payload?.invitation && action === 'removeInvitation') emit('removeInvitation', payload.invitation)
        else if (payload?.user && action === 'addUser') emit('addUser', payload.user)
        else if (payload?.user && action === 'removeUser') emit('removeUser', payload.user)
        input.value = ''
    }

    const clear = () => {
        matchingUsers.value?.clear()
        input.value = ''
    }

    return {
        input,
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
