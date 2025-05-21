import type { User } from '#/user'
import { useComposableQuasar } from '@/composables/useComposableQuasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCreateProjectForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const admins = ref<User[]>([])
    const pilots = ref<User[]>([])
    const controllers = ref<User[]>([])
    const name = ref<string>('')

    function addUser(value: { user: User; role: string }) {
        if (!isUserInArray(value.user)) {
            switch (value.role) {
                case 'admin':
                    admins.value.push(value.user)
                    break
                case 'pilot':
                    pilots.value.push(value.user)
                    break
                case 'controller':
                    controllers.value.push(value.user)
                    break
            }
        } else {
            notify({
                type: 'negative',
                color: 'blue-6',
                message: t('newProject.creation.userAlreadyAssigned'),
            })
        }
    }

    function removeUser(value: { user: User; role: string }) {
        switch (value.role) {
            case 'admin':
                admins.value = admins.value.filter((user) => user.id !== value.user.id)
                break
            case 'pilot':
                pilots.value = pilots.value.filter((user) => user.id !== value.user.id)
                break
            case 'controller':
                controllers.value = controllers.value.filter((user) => user.id !== value.user.id)
                break
        }
    }

    function isUserInArray(user: User) {
        for (var array of [admins, pilots, controllers]) {
            if (array.value.find((u) => u.id === user.id)) {
                return true
            }
        }
        return false
    }

    return {
        admins,
        pilots,
        controllers,
        name,
        addUser,
        removeUser,
        isUserInArray,
    }
}
