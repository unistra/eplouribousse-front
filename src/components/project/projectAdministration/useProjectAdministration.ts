import { useProjectStore } from '@/stores/projectStore'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useProjectAdministration() {
    const store = useProjectStore()
    const { t } = useI18n()

    const tabs = [
        { name: 'informations', label: t('project.administration.informations') },
        { name: 'libraries', label: t('project.administration.libraries') },
        { name: 'users', label: t('project.administration.users') },
        { name: 'alerts', label: t('project.administration.alerts') },
        { name: 'exclusions', label: t('project.administration.exclusions') },
        { name: 'errors', label: t('project.administration.errors') },
    ]
    const tab = ref<string>('informations')
    const storageOptions: string[] = []

    const addingExclusionReason = ref<boolean>(false)
    const newExclusionReason = ref<string>('')
    const onAddExclusionReason = async () => {
        await store.addExclusionReason(newExclusionReason.value)
        addingExclusionReason.value = false
        newExclusionReason.value = ''
    }
    const onCancelAddExclusionReason = () => {
        addingExclusionReason.value = false
        newExclusionReason.value = ''
    }

    return {
        tabs,
        tab,
        storageOptions,
        addingExclusionReason,
        newExclusionReason,
        onAddExclusionReason,
        onCancelAddExclusionReason,
    }
}
