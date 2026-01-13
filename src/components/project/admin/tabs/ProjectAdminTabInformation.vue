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
    await projectStore.patchProjectTitleAndDescription()
}
const { useHandleError } = useUtils()
const { notify } = useComposableQuasar()

const setProjectVisibility = async () => {
    try {
        await axiosI.patch(`/projects/${projectStore.project?.id || ''}/`, {
            is_private: projectStore.project?.isPrivate || false,
        })
        notify({
            message: t('views.project.settings.changeProjectVisibilitySuccess'),
            type: 'positive',
        })
    } catch (e) {
        useHandleError(e)
    }
}
</script>

<template>
    <div
        v-if="projectStore.project"
        class="infos"
    >
        <AtomicEditableField
            v-model="projectStore.project.name"
            :editable="projectStore.userIsAdmin"
            :label="t('common.name')"
            :rules="[
                () => projectStore.nameRequired || t('errors.form.fieldIsRequired'),
                () => projectStore.nameLengthValid || t('errors.form.fieldLessThan255'),
            ]"
            @save="onSave"
        />
        <AtomicEditableField
            v-model="projectStore.project.description"
            :editable="projectStore.userIsAdmin"
            :label="t('common.description')"
            type="textarea"
            @save="onSave"
        />
        <QChip
            v-if="!projectStore.projectLoading"
            class="chip-label-value"
        >
            {{ t('common.createdAt') }}
            <span>{{ useUtils().useIntlDateTimeFormat(projectStore.project.createdAt) }}</span>
            {{ t('common.by') }}
            <span>{{ projectStore.project.createdBy?.displayName || t('common.unknown') }}</span>
        </QChip>
        <QSkeleton
            v-else
            type="text"
        />
        <AtomicToggle
            v-if="projectStore.userIsAdmin"
            v-model="projectStore.project.isPrivate"
            :label="t('views.project.settings.privateMode')"
            @update:model-value="setProjectVisibility"
        />
        <QChip
            v-else
            class="chip-label-value"
            >{{ t('views.project.settings.visibility') }}:
            <span>{{ projectStore.project.isPrivate ? t('common.private') : t('common.public') }}</span></QChip
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
