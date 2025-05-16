import type { User } from '#/user'
import { axiosI } from '@/plugins/axios/axios'
import { ref } from 'vue'

export function useSearchUser() {
    const username = ref<string>('')
    const users = ref<User[]>([])
    const matchingUsers = ref<User[]>([])
    const isLoading = ref<boolean>(false)
    const nextPage = ref<number | null>(1)

    async function fillUsers() {
        isLoading.value = true

        const usersList = await axiosI.get('/users/?search=' + username.value)
        users.value = usersList.data.results
        nextPage.value = usersList.data.next

        if (username.value === '') {
            matchingUsers.value = []
            nextPage.value = null
        } else {
            matchingUsers.value = users.value.filter((user) => user.email.includes(username.value))
        }
        isLoading.value = false
    }

    async function appendUsers() {
        isLoading.value = true

        const usersList = await axiosI.get('/users/?page=' + nextPage.value + '&search=' + username.value)
        nextPage.value = usersList.data.next
        users.value.push(...usersList.data.results)
        if (username.value === '') {
            matchingUsers.value = []
            nextPage.value = null
        } else {
            matchingUsers.value = users.value.filter((user) => user.email.includes(username.value))
        }
        isLoading.value = false
    }

    return {
        username,
        users,
        matchingUsers,
        isLoading,
        nextPage,
        fillUsers,
        appendUsers,
    }
}
