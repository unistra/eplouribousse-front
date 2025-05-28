import type { User } from '#/user'
import { UniqueSet, type Comparator } from '#/utils'
import { ref } from 'vue'

export function useCreateProjectForm() {
    const userComparator: Comparator<User> = (a: User, b: User) => {
        return a.id === b.id
    }
    const admins = ref<UniqueSet<User>>(new UniqueSet<User>(userComparator))
    const pilots = ref<UniqueSet<User>>(new UniqueSet<User>(userComparator))
    const controllers = ref<UniqueSet<User>>(new UniqueSet<User>(userComparator))
    const name = ref<string>('')

    function addUser(value: { user: User; role: string }) {
        switch (value.role) {
            case 'admin':
                admins.value.add(value.user)
                break
            case 'pilot':
                pilots.value.add(value.user)
                break
            case 'controller':
                controllers.value.add(value.user)
                break
        }
    }

    function removeUser(value: { user: User; role: string }) {
        switch (value.role) {
            case 'admin':
                admins.value.remove(value.user)
                break
            case 'pilot':
                pilots.value.remove(value.user)
                break
            case 'controller':
                controllers.value.remove(value.user)
                break
        }
    }

    return {
        admins,
        pilots,
        controllers,
        name,
        addUser,
        removeUser,
    }
}
