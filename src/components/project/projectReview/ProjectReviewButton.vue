<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useProjectReview } from '@/components/project/projectReview/useProjectReview.ts'
import { computed } from 'vue'

const { t } = useI18n()

const store = useProjectStore()
const { dateModal, onConfirm, dateString, date, userIsAdmin, userIsManager, nowString } = useProjectReview()

const waitingMessage = computed(() => {
    if (store.status === 20) return t('project.review.waitingForAdminToReview')
    if (store.status === 30) return t('project.ready.waitingForManagerToStart')
    return t('common.waiting')
})
</script>

<template>
    <AtomicButton
        v-if="store.status === 20 && userIsAdmin"
        color="primary"
        confirm-button-color="primary"
        :label="t('project.review.passToReady')"
        no-border
        require-confirmation
        @confirm="store.passToReady"
    >
        <template #confirmation-content>
            <QCardSection>
                <p>{{ t('project.review.confirmPassToReview') }}</p>
                <p>{{ t('confirmDialogDefault.irreversible') }}</p>
            </QCardSection>
        </template>
    </AtomicButton>
    <template v-else-if="store.status === 30 && userIsManager">
        <AtomicButton
            color="primary"
            :label="t('project.ready.startTheProject')"
            no-border
            @click="dateModal = true"
        />
        <QDialog
            v-model="dateModal"
            persistent
        >
            <QCard>
                <QCardSection>
                    <p>{{ t('project.ready.defineStartDate') }}</p>
                    <AtomicInput
                        v-model="date"
                        :min="nowString"
                        outlined
                        rounded
                        type="datetime-local"
                        :value="nowString"
                    >
                    </AtomicInput>
                </QCardSection>
                <QCardActions align="right">
                    <AtomicButton
                        :label="t('common.cancel')"
                        @click="dateModal = false"
                    />
                    <AtomicButton
                        color="primary"
                        confirm-button-color="primary"
                        :label="t('common.confirm')"
                        no-border
                        require-confirmation
                        @confirm="onConfirm"
                    >
                        <template #confirmation-content>
                            <QCardSection>
                                <p>
                                    {{ t('project.ready.confirmStart') }} <strong>{{ dateString }}</strong>
                                </p>
                                <p>{{ t('confirmDialogDefault.irreversible') }}</p>
                            </QCardSection>
                        </template>
                    </AtomicButton>
                </QCardActions>
            </QCard>
        </QDialog>
    </template>
    <AtomicButton
        v-else
        class="align-end"
        disable
        icon-right="mdi-timer-sand"
        :label="waitingMessage"
        no-border
    />
</template>

<style lang="sass" scoped>
.project-review
    > .q-btn, .align-end
        align-self: end

    .q-card__section
        strong
            font-weight: bold
</style>
