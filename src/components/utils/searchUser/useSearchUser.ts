import { type UserI } from '#/user'
import { type Comparator, UniqueSet } from '#/utils'
import { axiosI } from '@/plugins/axios/axios'
import { ref, watch } from 'vue'
import type { ProjectInvitation } from '#/project'

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

    const userComparator: Comparator<UserI> = (a: UserI, b: UserI) => a.id === b.id
    const isUserListLoading = ref<boolean>(false)
    const nextPage = ref<number | null>(1)
    const filter = ref<Set<string>>(new Set<string>())

    watch(username, async (newValue) => {
        if (newValue === '') {
            users.value = []
            matchingUsers.value?.clear()
            nextPage.value = null
        } else {
            await fillUsers()
        }
    })

    function constructQueryWithExcludedIDs() {
        if (filter.value.size === 0) {
            return ''
        } else {
            let filterQuery = '&exclude='
            filter.value.forEach((element) => {
                filterQuery += element
                filterQuery += ','
            })
            return filterQuery
        }
    }

    async function fillUsers() {
        isUserListLoading.value = true

        try {
            const usersList = await axiosI.get('/users/?search=' + username.value + constructQueryWithExcludedIDs())
            users.value = usersList.data.results
            nextPage.value = usersList.data.next

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
            const usersList = await axiosI.get(
                '/users/?page=' + nextPage.value + '&search=' + username.value + constructQueryWithExcludedIDs(),
            )
            nextPage.value = usersList.data.next
            users.value.push(...usersList.data.results)
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
        filter,
        onLoad,
        sendAction,
        clear,
    }
}
