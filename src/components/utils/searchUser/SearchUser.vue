<script lang="ts" setup>
import { onMounted } from 'vue'
import { useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'
import type { ProjectInvitation, UserRoleUser } from '#/project'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

defineProps<{
    usersSelected: UserRoleUser[]
    invitationsSelected: ProjectInvitation[]
}>()
const { t } = useI18n()
const emit = defineEmits<{
    (e: 'addInvitation', email: string): void
    (e: 'removeInvitation', invitation: ProjectInvitation): void
    (e: 'addUser', userId: string): void
    (e: 'removeUser', userId: string): void
}>()
const { username, matchingUsers, onLoad } = useSearchUser()

onMounted(() => {
    matchingUsers.value?.clear()
})

const sendAction = (
    action: 'addInvitation' | 'removeInvitation' | 'addUser' | 'removeUser',
    payload?: { invitation?: ProjectInvitation; userId?: string },
) => {
    if (action === 'addInvitation') emit('addInvitation', username.value)
    else if (payload?.invitation && action === 'removeInvitation') emit('removeInvitation', payload.invitation)
    else if (payload?.userId && action === 'addUser') emit('addUser', payload.userId)
    else if (payload?.userId && action === 'removeUser') emit('removeUser', payload.userId)
    username.value = ''
}

const clear = () => {
    matchingUsers.value?.clear()
    username.value = ''
}
</script>

<template>
    <div class="container column">
        <AtomicInput
            v-model="username"
            clearable
            data-testid="search"
            dense
            icon="mdi-magnify"
            :label="t('utils.searchUser.inputPlaceholder')"
            :tooltip="t('utils.searchUser.inputPlaceholder')"
            @clear="clear"
        />

        <QList
            v-if="username.length > 0"
            id="scroll"
            bordered
            class="scroll"
            data-testid="list"
            style="max-height: 10rem"
        >
            <QItem v-if="matchingUsers?.size() === 0 && username.length > 0">
                <QItemSection>{{ t('utils.searchUser.inviteText') }}: {{ username }}</QItemSection>
                <AtomicButton
                    icon="mdi-plus"
                    size="sm"
                    @click="sendAction('addInvitation')"
                />
            </QItem>
            <QInfiniteScroll
                data-testid="scroll"
                :offset="150"
                scroll-target="#scroll"
                @load="onLoad"
            >
                <QItem
                    v-for="user in matchingUsers?.values()"
                    :key="user.id"
                    class="container row"
                    clickable
                    @click="sendAction('addUser', { userId: user.id })"
                >
                    <QItemSection>
                        <!--{{ user.email || 'No email' }}-->
                        {{ user.firstName || 'No firstName' }}
                        {{ user.lastName || 'No lastName' }} - {{ 'No email' }}
                    </QItemSection>
                </QItem>
            </QInfiniteScroll>
        </QList>
        <template v-if="usersSelected.length > 0 || invitationsSelected.length > 0">
            <QItem
                v-for="(invitation, index) in invitationsSelected"
                :key="index"
            >
                <QItemSection>
                    <!--{{ user.email || 'No email' }}-->
                    📨 {{ invitation.email }}
                </QItemSection>
                <AtomicButton
                    icon="mdi-close"
                    :no-border="true"
                    @click="sendAction('removeInvitation', { invitation: invitation })"
                />
            </QItem>
            <QItem
                v-for="user in usersSelected"
                :key="user.id"
            >
                <QItemSection>
                    {{ user.firstName || 'No firstName' }}
                    {{ user.lastName || 'No lastName' }} - {{ 'No email' }}
                </QItemSection>
                <AtomicButton
                    icon="mdi-close"
                    :no-border="true"
                    @click="sendAction('removeUser', { userId: user.id })"
                />
            </QItem>
        </template>
    </div>
</template>
