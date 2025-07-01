import { type UserI } from '#/user'
import { type Comparator, UniqueSet } from '#/utils'
import { axiosI } from '@/plugins/axios/axios'
import { ref, watch } from 'vue'

export function useSearchUser() {
    const username = ref<string>('')
    const users = ref<UserI[]>([])
    const matchingUsers = ref<UniqueSet<UserI>>()

    const userComparator: Comparator<UserI> = (a: UserI, b: UserI) => a.id === b.id
    const isLoading = ref<boolean>(false)
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
        isLoading.value = true

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
            isLoading.value = false
        }
    }

    async function appendUsers() {
        isLoading.value = true
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
            isLoading.value = false
        }
    }

    async function onLoad(_index: number, done: () => void) {
        if (matchingUsers.value?.size && matchingUsers.value.size() >= 10 && nextPage.value !== null) {
            isLoading.value = true
            await appendUsers()
            done()
        } else {
            done()
        }
    }

    return {
        username,
        users,
        matchingUsers,
        isLoading,
        nextPage,
        filter,
        fillUsers,
        appendUsers,
        onLoad,
    }
}
