<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { reactive, ref } from 'vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()
const store = useProjectStore()

const emailAlerts = reactive({
    positionning: false,
    arbitrary0: false,
    arbitrary1: false,
    instructions: false,
    results: false,
})

const storageOptions: string[] = []

const transferTracking = ref<boolean>(false)
const treatmentTracking = ref<boolean>(false)

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
</script>

<template>
    <QList>
        <QItem>
            <AtomicToggle
                v-model="store.isPrivate"
                :label="t('project.settings.privateMode')"
                left-label
            />
        </QItem>
        <QItem class="email-alerts">
            <p>{{ t('project.settings.emailAlert.title') }}</p>
            <QList class="toggles">
                <QItem
                    v-for="key in Object.keys(emailAlerts)"
                    :key="key"
                >
                    <AtomicToggle
                        v-model="emailAlerts[key as keyof typeof emailAlerts]"
                        :label="t(`project.settings.emailAlert.${key}`)"
                        left-label
                    />
                </QItem>
            </QList>
        </QItem>
        <QItem class="storage">
            <p>{{ t('project.settings.defaultStorageLocation') }}</p>
            <AtomicSelect
                :label="t('project.settings.defaultStorageLocation')"
                :options="storageOptions"
            />
        </QItem>
        <QItem>
            <AtomicToggle
                v-model="transferTracking"
                :label="t('project.settings.transferTracking')"
                left-label
            />
        </QItem>
        <QItem>
            <AtomicToggle
                v-model="treatmentTracking"
                :label="t('project.settings.treatmentTracking')"
                left-label
            />
        </QItem>
        <QItem class="exclusions">
            <p>{{ t('project.settings.exclusionReason') }}</p>
            <QList>
                <QItem
                    v-for="exclusionReason in store.settings.exclusionReasons"
                    :key="exclusionReason"
                >
                    <p>{{ exclusionReason }}</p>
                    <AtomicButton
                        icon="mdi-close"
                        no-border
                        size="xs"
                        @click="store.removeExclusionReason(exclusionReason)"
                    />
                </QItem>
                <QItem>
                    <AtomicButton
                        v-if="!addingExclusionReason"
                        icon="mdi-plus"
                        size="xs"
                        @click="addingExclusionReason = true"
                    />
                    <AtomicInput
                        v-else
                        v-model="newExclusionReason"
                        :label="t('project.settings.exclusionReason')"
                        quick-input
                        @cancel="onCancelAddExclusionReason"
                        @done="onAddExclusionReason"
                    />
                </QItem>
            </QList>
        </QItem>
    </QList>
</template>

<style lang="sass" scoped>
.email-alerts, .storage, .exclusions
    display: flex
    flex-direction: column

.exclusions
    .q-list
        .q-item
            display: flex
            align-items: center
            gap: 1rem
            .q-btn
                width: fit-content
</style>
