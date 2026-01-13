<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useProjectReview } from '@/components/project/projectReview/useProjectReview.ts'
import { computed } from 'vue'
import { ProjectStatus } from '&/project.ts'

const { t } = useI18n()

const projectStore = useProjectStore()
const {
    dateModal,
    dateString,
    date,
    userIsAdmin,
    userIsManager,
    nowString,
    passProjectToReady,
    passProjectToLaunched,
} = useProjectReview()

const waitingMessage = computed(() => {
    if (!projectStore.project) return t('errors.unknown')
    if (projectStore.project.status === ProjectStatus.Review) return t('views.project.review.waitingForAdminToReview')
    if (projectStore.project.status === ProjectStatus.Ready) return t('views.project.ready.waitingForManagerToStart')
    return t('common.waiting')
})
</script>
<template>
    <template v-if="projectStore.project">
        <AtomicButton
            v-if="projectStore.project.status === ProjectStatus.Review && userIsAdmin"
            color="primary"
            confirm-button-color="primary"
            :label="t('views.project.review.passToReady')"
            no-border
            require-confirmation
            @confirm="passProjectToReady"
        >
            <template #confirmation-content>
                <QCardSection>
                    <p>{{ t('views.project.review.confirmPassToReview') }}</p>
                    <p>{{ t('views.confirmDialogDefault.irreversible') }}</p>
                </QCardSection>
            </template>
        </AtomicButton>
        <template v-else-if="projectStore.project.status === ProjectStatus.Ready && userIsManager">
            <AtomicButton
                color="primary"
                :label="t('views.project.ready.startTheProject')"
                no-border
                @click="dateModal = true"
            />
            <QDialog
                v-model="dateModal"
                persistent
            >
                <QCard>
                    <QCardSection>
                        <p>{{ t('views.project.ready.defineStartDate') }}</p>
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
                            @confirm="passProjectToLaunched"
                        >
                            <template #confirmation-content>
                                <QCardSection>
                                    <p>
                                        {{ t('views.project.ready.confirmStart') }} <strong>{{ dateString }}</strong>
                                    </p>
                                    <p>{{ t('views.confirmDialogDefault.irreversible') }}</p>
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
</template>

<style lang="sass" scoped>
.project-review
    > .q-btn, .align-end
        align-self: end

    .q-card__section
        strong
            font-weight: bold
</style>
