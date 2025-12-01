<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'
import AtomicEditableField from '@/components/atomic/AtomicEditableField.vue'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

const projectStore = useProjectStore()
const { t } = useI18n()

const onSave = async () => {
    await projectStore._patchTitleAndDescription()
}
const { useHandleError } = useUtils()
const { notify } = useComposableQuasar()

const setProjectVisibility = async () => {
    try {
        await axiosI.patch(`/projects/${projectStore.id}/`, {
            is_private: projectStore.isPrivate,
        })
        notify({
            message: t('project.settings.changeProjectVisibilitySuccess'),
            type: 'positive',
        })
    } catch (e) {
        useHandleError(e)
    }
}
</script>

<template>
    <div class="infos">
        <AtomicEditableField
            v-model="projectStore.name"
            :editable="projectStore.userIsAdmin"
            :label="t('common.name')"
            :rules="[
                () => projectStore.nameRequired || t('forms.validation.fieldIsRequired'),
                () => projectStore.nameLengthValid || t('forms.validation.fieldLessThan255'),
            ]"
            @save="onSave"
        />
        <AtomicEditableField
            v-model="projectStore.description"
            :editable="projectStore.userIsAdmin"
            :label="t('common.description')"
            type="textarea"
            @save="onSave"
        />
        <QChip
            v-if="!projectStore.isLoading"
            class="chip-label-value"
        >
            {{ t('common.createdAt') }}
            <span>{{ useUtils().useIntlDateTimeFormat(projectStore.createdAt) }}</span>
            {{ t('common.by') }}
            <span>{{ projectStore.createdBy?.displayName || t('common.unknown') }}</span>
        </QChip>
        <QSkeleton
            v-else
            type="text"
        />
        <AtomicToggle
            v-if="projectStore.userIsAdmin"
            v-model="projectStore.isPrivate"
            :label="t('project.settings.privateMode')"
            @update:model-value="setProjectVisibility"
        />
        <QChip
            v-else
            class="chip-label-value"
            >{{ t('project.settings.visibility') }}:
            <span>{{ projectStore.isPrivate ? t('common.private') : t('common.public') }}</span></QChip
        >
    </div>
</template>

<style scoped lang="sass">
.infos
    display: flex
    flex-direction: column
    gap: 1rem
    .q-chip
        width: fit-content
</style>
