<script setup lang="ts">
import type { ProjectInvitation } from '#/project.ts'
import type { UserSummarized } from '#/user.ts'
import type { SearchUserSendAction } from '@/components/utils/searchUser/useSearchUser.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { ProjectStatus } from '&/project.ts'

const props = defineProps<{
    usersSelected: UserSummarized[]
    invitationsSelected: ProjectInvitation[]
    summaryMode?: boolean
    preventDeleteCurrentUser?: boolean
    sendAction?: SearchUserSendAction
}>()

const userStore = useUserStore()
const { t } = useI18n()
const projectStore = useProjectStore()
const hasAlwaysOneUserSelectedAfterProjectIsDraft = computed(() => {
    if (projectStore.project?.status === ProjectStatus.Draft) return true // Project is draft so we allow deletion

    return props.usersSelected.length > 1
})
</script>

<template>
    <div class="container">
        <template v-if="usersSelected.length || invitationsSelected.length">
            <QChip
                v-for="invitation in invitationsSelected"
                :key="invitation.email"
                icon="mdi-email-fast-outline"
                icon-remove="mdi-close"
                :label="invitation.email"
                :removable="!summaryMode && hasAlwaysOneUserSelectedAfterProjectIsDraft"
                size="1rem"
                @remove="sendAction && sendAction('removeInvitation', { invitation: invitation })"
            />
            <QChip
                v-for="user in usersSelected"
                :key="user.id"
                icon="mdi-account-circle"
                icon-remove="mdi-close"
                :label="user.displayName"
                :removable="
                    !(preventDeleteCurrentUser && user.id === userStore.user?.id) &&
                    !summaryMode &&
                    hasAlwaysOneUserSelectedAfterProjectIsDraft
                "
                size="1rem"
                @remove="sendAction && sendAction('removeUser', { user: user })"
            />
        </template>
        <QChip v-else>{{ t('views.project.libraries.card.noUser') }}</QChip>
    </div>
</template>

<style scoped lang="sass">
.container
    display: flex
    align-items: center
    flex-wrap: wrap
    gap: 0.125rem

    .q-chip
        background-color: var(--color-white)
        margin: 0
</style>
