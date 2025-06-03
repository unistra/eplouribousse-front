import { type User } from '#/user'
import { UniqueSet, type Comparator } from '#/utils'
import { ref } from 'vue'

export function useCreateProjectForm() {
    const userComparator: Comparator<User> = (a: User, b: User) => {
        return a.id === b.id
    }
    const projectUsers = ref<UniqueSet<User>>(new UniqueSet<User>(userComparator))
    const userToExclude = ref<User | undefined>(undefined)
    const userToInject = ref<User | undefined>(undefined)
    const name = ref<string>('')

    function addUser(value: { user: User; role: string }) {
        value.user.role = value.role
        projectUsers.value.add(value.user)
        userToExclude.value = value.user
    }

    function removeUser(user: User) {
        projectUsers.value.remove(user)
        userToInject.value = user
    }

    function getUsersByRole(role: string) {
        let users: User[] = []
        projectUsers.value.values().forEach((user: User) => {
            if (user.role && user.role === role) {
                users.push(user)
                console.log(user)
            }
        })
        return users
    }

    return {
        projectUsers,
        userToExclude,
        userToInject,
        name,
        addUser,
        removeUser,
        getUsersByRole,
    }
}
