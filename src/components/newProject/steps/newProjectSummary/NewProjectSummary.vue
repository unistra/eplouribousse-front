<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import NewProjectLibraryCard from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraryCard.vue'
import { useNewProjectRoles } from '@/components/newProject/steps/newProjectRoles/useNewProjectRoles.ts'
import { useI18n } from 'vue-i18n'

const store = useProjectStore()
const { roles } = useNewProjectRoles()
const { t } = useI18n()
</script>

<template>
    <p class="text-2xl">{{ store.name }}</p>
    <p>{{ store.description }}</p>
    <div class="container">
        <NewProjectLibraryCard
            v-for="library in store.libraries"
            :key="library.id"
            is-summary
            :library="library"
        />
    </div>
    <QList
        v-for="role in roles"
        :key="role.role"
    >
        <p>{{ role.title }}</p>
        <template
            v-if="
                store.roles.filter((userRole) => role.role === userRole.role).length &&
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
</template>
