<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import ProjectSummary from '@/components/project/stepper/steps/summary/ProjectSummary.vue'
import ProjectReviewButton from '@/components/project/projectReview/ProjectReviewButton.vue'

const { t } = useI18n()
</script>

<template>
    <div class="project-review">
        <hgroup>
            <h1>{{ t('project.review.title') }}</h1>
            <AtomicButton
                dense
                flat
                icon="mdi-cog"
                round
                :to="{ name: 'projectAdmin' }"
            />
        </hgroup>
        <ProjectSummary />
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
</style>
