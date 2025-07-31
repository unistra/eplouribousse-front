<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import ProjectLibraryCard from '@/components/project/projectStepper/steps/projectLibraries/ProjectLibraryCard.vue'
import { useProjectRoles } from '@/components/project/projectStepper/steps/projectRoles/useProjectRoles.ts'

const store = useProjectStore()
const { roles } = useProjectRoles()
const { t } = useI18n()
</script>

<template>
    <div class="summary">
        <hgroup>
            <p class="label">{{ t('newProject.steps.informations.name') }}</p>
            <h2>{{ store.name }}</h2>
        </hgroup>
        <div class="description">
            <p class="label">{{ t('newProject.steps.informations.description') }}</p>
            <p :class="{ 'no-description': !store.description }">
                {{ store.description || t('newProject.steps.informations.noDescription') }}
            </p>
        </div>
        <div class="libraries">
            <p class="label">{{ t('newProject.steps.libraries.title') }}</p>
            <div class="cards">
                <ProjectLibraryCard
                    v-for="library in store.libraries"
                    :key="library.id"
                    is-summary
                    :library="library"
                />
            </div>
        </div>
        <QList
            v-for="role in roles"
            :key="role.role"
        >
            <p>{{ role.title }}</p>
            <template
                v-if="
                    store.roles.filter((userRole) => role.role === userRole.role).length ||
                    store.invitations.filter((invitation) => role.role === invitation.role).length
                "
            >
                <QItem
                    v-for="invitation in store.invitations.filter((invitation) => role.role === invitation.role)"
                    :key="invitation.email"
                >
                    <span>📨 {{ invitation.email }}</span>
                </QItem>
                <QItem
                    v-for="userRole in store.roles.filter((userRole) => role.role === userRole.role)"
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
</template>

<style lang="sass" scoped>
.summary
    display: flex
    flex-flow: column nowrap
    gap: 1rem
    width: 100%

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

        .no-description
            font-style: italic
            color: var(--color-neutral-500)

    .libraries
        .cards
            display: flex
            flex-flow: row wrap
            justify-content: space-evenly
            gap: 1rem
</style>
