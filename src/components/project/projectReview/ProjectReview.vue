<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import ProjectSettings from '@/components/project/projectSettings/ProjectSettings.vue'
import { useProjectReview } from '@/components/project/projectReview/useProjectReview.ts'
import ProjectSummary from '@/components/project/projectStepper/steps/projectSummary/ProjectSummary.vue'
import ProjectReviewButton from '@/components/project/projectReview/ProjectReviewButton.vue'

const { t } = useI18n()
const { settingsMode, userIsAdmin } = useProjectReview()
</script>

<template>
    <div class="project-review">
        <hgroup>
            <template v-if="!settingsMode">
                <h2>{{ t('project.review.title') }}</h2>
                <AtomicButton
                    v-if="userIsAdmin"
                    icon="mdi-cog"
                    no-border
                    @click="settingsMode = true"
                />
            </template>
            <template v-else>
                <h2>{{ t('project.settings.title') }}</h2>
                <AtomicButton
                    icon="mdi-close"
                    no-border
                    @click="settingsMode = false"
                />
            </template>
        </hgroup>

        <KeepAlive>
            <ProjectSummary v-if="!settingsMode" />
            <ProjectSettings v-else />
        </KeepAlive>

        <ProjectReviewButton />
    </div>
</template>

<style lang="sass" scoped>
.project-review
    display: flex
    flex-direction: column
    gap: 1rem
    width: 100%

    hgroup
        display: flex
        justify-content: space-between
        align-items: center
        h2
            font-size: var(--font-size-3xl)
</style>
