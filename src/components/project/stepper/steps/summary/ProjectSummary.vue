<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import ProjectLibraryCard from '@/components/project/libraries/card/ProjectLibraryCard.vue'
import { useProjectRoles } from '@/components/project/stepper/steps/roles/useProjectRoles.ts'
import { checkValidityProjectStepper } from '@/components/project/stepper/useProjectStepper.ts'
import { useUtils } from '@/composables/useUtils.ts'

const projectStore = useProjectStore()
const { roles } = useProjectRoles()
const { t } = useI18n()

const { checkValidityForRolesStep, checkValidityForLibraryStep } = checkValidityProjectStepper()
</script>

<template>
    <div class="summary">
        <QChip
            v-if="projectStore.activeAfter && new Date(projectStore.activeAfter) > new Date()"
            class="info"
            icon="mdi-information"
            size="lg"
        >
            {{ t('newProject.steps.informations.startInFuture') }}
            {{ useUtils().useIntlDateTimeFormat(projectStore.activeAfter) }}
        </QChip>

        <hgroup>
            <p class="label">{{ t('newProject.steps.informations.name') }}</p>
            <h2>{{ projectStore.name }}</h2>
        </hgroup>
        <div class="description">
            <p class="label">{{ t('newProject.steps.informations.description') }}</p>
            <p :class="{ 'no-description': !projectStore.description }">
                {{ projectStore.description || t('newProject.steps.informations.noDescription') }}
            </p>
        </div>
        <QSeparator />
        <div class="libraries">
            <p class="label">{{ t('newProject.steps.libraries.title') }}</p>
            <div
                v-if="!checkValidityForLibraryStep"
                class="errors"
            >
                <QIcon
                    name="mdi-alert"
                    size="sm"
                />
                <p>{{ t('newProject.steps.summary.errors.libraries') }}</p>
            </div>
            <div class="cards">
                <ProjectLibraryCard
                    v-for="library in projectStore.libraries"
                    :key="library.id"
                    is-summary
                    :library="library"
                />
            </div>
        </div>
        <QSeparator />
        <div class="roles">
            <p class="label">{{ t('newProject.steps.roles.title') }}</p>
            <div
                v-if="!checkValidityForRolesStep"
                class="errors"
            >
                <QIcon
                    name="mdi-alert"
                    size="sm"
                />
                <p>{{ t('newProject.steps.summary.errors.roles') }}</p>
            </div>
            <QList
                v-for="role in roles"
                :key="role.role"
            >
                <p>{{ role.title }}</p>
                <template
                    v-if="
                        projectStore.roles.filter((userRole) => role.role === userRole.role).length ||
                        projectStore.invitations.filter((invitation) => role.role === invitation.role).length
                    "
                >
                    <QItem
                        v-for="invitation in projectStore.invitations.filter((inv) => role.role === inv.role)"
                        :key="invitation.email"
                    >
                        <span>📨 {{ invitation.email }}</span>
                    </QItem>
                    <QItem
                        v-for="userRole in projectStore.roles.filter((usrRole) => role.role === usrRole.role)"
                        :key="userRole.user.id"
                    >
                        <span
                            >{{ userRole.user.firstName || '***' }} {{ userRole.user.lastName || `***` }} -
                            {{ userRole.user.email || `${t('common.none')} ${t('common.email')}` }}</span
                        >
                    </QItem>
                </template>
                <QItem v-else>{{ t('newProject.steps.summary.noUser') }}</QItem>
            </QList>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.summary
    display: flex
    flex-flow: column nowrap
    gap: 2rem
    width: 100%

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
        h1
            margin-left: 2rem

    .description
        > :last-child
            margin-left: 2rem
            padding: 1rem
            background-color: var(--color-neutral-100)
            border-radius: var(--border-radius)

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
        display: flex
        flex-direction: column
        gap: 1rem
</style>
