<script setup lang="ts">
import type { ProjectInvitation } from '#/project.ts'
import type { UserSummarized } from '#/user.ts'
import type { SearchUserSendAction } from '@/components/utils/searchUser/useSearchUser.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useI18n } from 'vue-i18n'

defineProps<{
    usersSelected: UserSummarized[]
    invitationsSelected: ProjectInvitation[]
    summaryMode?: boolean
    preventDeleteCurrentUser?: boolean
    sendAction?: SearchUserSendAction
}>()

const userStore = useUserStore()
const { t } = useI18n()
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
                :removable="!summaryMode"
                size="1rem"
                @remove="sendAction && sendAction('removeInvitation', { invitation: invitation })"
            />
            <QChip
                v-for="user in usersSelected"
                :key="user.id"
                icon="mdi-account-circle"
                icon-remove="mdi-close"
                :label="user.displayName"
                :removable="!(preventDeleteCurrentUser && user.id === userStore.user?.id) && !summaryMode"
                size="1rem"
                @remove="sendAction && sendAction('removeUser', { user: user })"
            />
        </template>
        <QChip v-else>{{ t('utils.noUser') }}</QChip>
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
