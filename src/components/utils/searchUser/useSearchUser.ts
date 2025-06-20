import { type User } from '#/user'
import { UniqueSet, type Comparator } from '#/utils'
import { axiosI } from '@/plugins/axios/axios'
import { computed, ref } from 'vue'

export function useSearchUser() {
    const userComparator: Comparator<User> = (a: User, b: User) => {
        return a.id === b.id
    }
    const getter = computed(() => username.value)
    const username = ref<string>('')
    const users = ref<User[]>([])
    const matchingUsers = ref<UniqueSet<User>>()
    const isLoading = ref<boolean>(false)
    const nextPage = ref<number | null>(1)
    const filter = ref<Set<string>>(new Set<string>())

    function constructQueryWithExcludedIDs() {
        if (filter.value.size === 0) {
            return ''
        } else {
            let filterQuery = '&exclude_ids='
            filter.value.forEach((element) => {
                filterQuery += element
                filterQuery += ','
            })
            return filterQuery
        }
    }

    async function fillUsers() {
        isLoading.value = true
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
        isLoading.value = false
    }

    async function appendUsers() {
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
    }

    /* eslint-disable */
    function onLoad(_index: number, done: any) {
        if (matchingUsers.value?.size && matchingUsers.value.size() >= 10 && nextPage.value !== null) {
            isLoading.value = true
            appendUsers()
            done()
        } else {
            done()
        }
    }
    /* eslint-enable */

    return {
        username,
        getter,
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
