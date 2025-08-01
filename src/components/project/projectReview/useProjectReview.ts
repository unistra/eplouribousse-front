import { computed, type ComputedRef, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { dateToFormat } from '@/utils/utils.ts'
import { useUserStore } from '@/stores/userStore.ts'

export const useProjectReview = () => {
    const projectStore = useProjectStore()
    const userStore = useUserStore()

    const settingsMode = ref<boolean>(false)
    const dateModal = ref<boolean>(false)

    const userIsAdmin: ComputedRef<boolean> = computed(() =>
        projectStore.roles.some((el) => el.user.id === userStore.user?.id && el.role === 'project_admin'),
    )
    const userIsManager: ComputedRef<boolean> = computed(() =>
        projectStore.roles.some((el) => el.user.id === userStore.user?.id && el.role === 'project_manager'),
    )

    const today = new Date()
    const todayStringEN = dateToFormat(today, 'YYYYMMDD', '-')
    const date = ref<string>(todayStringEN)
    const dateStringFR = computed(() => {
        const [year, month, day] = date.value.split('-')
        return `${day}/${month}/${year}`
    })

    const onConfirm = async () => {
        await projectStore.startTheProject()
        dateModal.value = false
    }

    return {
        dateModal: dateModal,
        onConfirm,
        settingsMode,
        date,
        dateStringFR,
        todayStringEN,
        userIsAdmin,
        userIsManager,
    }
}
