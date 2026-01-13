<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import ProjectLibraryCard from '@/components/project/libraries/card/ProjectLibraryCard.vue'
import { checkValidityProjectStepper } from '@/components/project/stepper/useProjectStepper.ts'
import { useUtils } from '@/composables/useUtils.ts'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { Roles } from '&/project.ts'

const projectStore = useProjectStore()
const { t } = useI18n()

const { checkValidityForLibraryStep } = checkValidityProjectStepper()
</script>

<template>
    <div
        v-if="projectStore.project"
        class="summary"
    >
        <h1>{{ t('views.project.new.stepper.steps.summary.title') }}</h1>
        <QChip
            v-if="projectStore.project.activeAfter && new Date(projectStore.project.activeAfter) > new Date()"
            class="info"
            icon="mdi-information"
            size="lg"
        >
            {{ t('views.project.new.stepper.steps.informations.startInFuture') }}
            {{ useUtils().useIntlDateTimeFormat(projectStore.project.activeAfter) }}
        </QChip>

        <hgroup>
            <p class="label">{{ t('views.project.new.stepper.steps.informations.name') }}</p>
            <h2>{{ projectStore.project.name }}</h2>
        </hgroup>

        <div class="description">
            <p class="label">{{ t('views.project.new.stepper.steps.informations.description') }}</p>
            <p :class="{ 'no-description': !projectStore.project.description }">
                {{
                    projectStore.project.description || t('views.project.new.stepper.steps.informations.noDescription')
                }}
            </p>
        </div>
        <QSeparator />
        <div class="libraries">
            <p class="label">{{ t('fn.library.participating') }}</p>
            <div
                v-if="!checkValidityForLibraryStep"
                class="errors"
            >
                <QIcon
                    name="mdi-alert"
                    size="sm"
                />
                <p>{{ t('errors.library.summary', 2) }}</p>
            </div>
            <div class="cards">
                <ProjectLibraryCard
                    v-for="library in projectStore.project.libraries"
                    :key="library.id"
                    :library="library"
                    summary-mode
                />
            </div>
        </div>
        <QSeparator />
        <p class="label">{{ t('views.project.new.stepper.steps.roles.tab') }}</p>
        <div class="roles">
            <SearchUser
                v-for="role in [
                    [Roles.ProjectAdmin, t('fn.roles.projectAdmin', 2)],
                    [Roles.Controller, t('fn.roles.controller', 2)],
                    [Roles.ProjectManager, t('fn.roles.projectManager', 2)],
                    [Roles.Guest, t('fn.roles.guest', 2)],
                ]"
                :key="role[0]"
                :invitations-selected="projectStore.project.invitations.filter((el) => el.role === role[0])"
                :label="role[1]"
                summary-mode
                :users-selected="projectStore.project.roles.filter((el) => el.role === role[0]).map((el) => el.user)"
            />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.summary
    display: flex
    flex-flow: column nowrap
    gap: 2rem

    h1
        font-size: var(--font-size-xl)

    .info
        background-color: var(--color-info)
        width: fit-content
        align-self: center
        border-radius: var(--border-radius-pills)

        &, ::v-deep(.q-icon)
            color: var(--text-color-dark)


    p.label
        font-size: var(--font-size-sm)
        color: var(--color-neutral-500)

    hgroup
        h2
            font-size: var(--font-size-3xl)
            margin-left: 2rem

    .description
        > :last-child
            margin-left: 2rem
            padding: 1rem
            background-color: var(--color-neutral-100)
            border-radius: var(--border-radius)
            white-space: pre-line

        .no-description
            font-style: italic
            color: var(--color-neutral-500)

    .libraries
        display: flex
        flex-direction: column
        gap: 1rem

        .cards
            display: flex
            flex-flow: row wrap
            justify-content: space-evenly
            gap: 1rem

    .errors
        display: flex
        align-items: center
        width: fit-content
        color: var(--color-red)
        font-weight: bold
        gap: 1rem

    .roles
        display: grid
        grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr))
        gap: 1rem
</style>
