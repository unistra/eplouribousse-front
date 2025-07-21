import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { dateToFormat } from '@/utils/utils.ts'

export const useProjectReview = () => {
    const store = useProjectStore()

    const settingsMode = ref<boolean>(false)
    const dateModal = ref<boolean>(false)

    const today = new Date()
    const todayStringEN = dateToFormat(today, 'YYYYMMDD', '-')
    const date = ref<string>(todayStringEN)
    const dateStringFR = computed(() => {
        const [year, month, day] = date.value.split('-')
        return `${day}/${month}/${year}`
    })

    const onConfirm = async () => {
        await store.startTheProject()
        dateModal.value = false
    }

    return {
        dateModal: dateModal,
        onConfirm,
        settingsMode,
        date,
        dateStringFR,
        todayStringEN,
    }
}
