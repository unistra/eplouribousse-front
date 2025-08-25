import { computed, type ComputedRef, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { Roles } from '#/project.ts'

export const useProjectReview = () => {
    const projectStore = useProjectStore()
    const userStore = useUserStore()

    const settingsMode = ref<boolean>(false)
    const dateModal = ref<boolean>(false)

    const userIsAdmin: ComputedRef<boolean> = computed(() =>
        projectStore.roles.some((el) => el.user.id === userStore.user?.id && el.role === Roles.ProjectAdmin),
    )
    const userIsManager: ComputedRef<boolean> = computed(() =>
        projectStore.roles.some((el) => el.user.id === userStore.user?.id && el.role === Roles.ProjectManager),
    )

    const nowString = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Paris' }).replace(' ', 'T').slice(0, -3) // 'sv-SE' match the format for the input + the datetime of Paris
    const date = ref<string>(nowString)
    const dateString = computed(() =>
        new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date.value)),
    )

    const onConfirm = async () => {
        await projectStore.startTheProject(date.value)
        dateModal.value = false
    }

    return {
        dateModal: dateModal,
        onConfirm,
        settingsMode,
        date,
        dateString,
        nowString,
        userIsAdmin,
        userIsManager,
    }
}
