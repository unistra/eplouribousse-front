<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { type SearchUserEmitActions, useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'
import type { ProjectInvitation, ProjectUser } from '#/project'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import SearchUserItem from '@/components/utils/searchUser/SearchUserItem.vue'

const props = defineProps<{
    usersSelected: ProjectUser[]
    invitationsSelected: ProjectInvitation[]
    isAddUserLoading: boolean
}>()
const { t } = useI18n()

const emit = defineEmits<SearchUserEmitActions>()
const { username, matchingUsers, onLoad, sendAction, clear, isUserListLoading, userAlreadySelected } =
    useSearchUser(emit)

watch(
    () => props.usersSelected,
    () => {
        userAlreadySelected.value = props.usersSelected
    },
)

onMounted(() => {
    matchingUsers.value?.clear()
    userAlreadySelected.value = props.usersSelected
})
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
            <QItem v-if="matchingUsers?.size() === 0 && username.length > 0 && isUserListLoading === false">
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
                        {{ user.firstName || '***' }}
                        {{ user.lastName || `***` }} -
                        {{ user.email || `${t('common.none')} ${t('common.email')}` }}
                    </QItemSection>
                </QItem>
                <QItem
                    v-if="isUserListLoading"
                    class="container justify-center items-center"
                >
                    <QSpinner size="1.5rem" />
                </QItem>
            </QInfiniteScroll>
        </QList>
        <QList
            v-if="usersSelected.length > 0 || invitationsSelected.length > 0"
            class="user-list"
        >
            <div
                v-if="isAddUserLoading"
                class="user-spinner"
            >
                <QSpinner size="1.5rem" />
            </div>
            <SearchUserItem
                v-for="invitation in invitationsSelected"
                :key="invitation.email"
                @delete="sendAction('removeInvitation', { invitation: invitation })"
            >
                <p>📨 {{ invitation.email }}</p>
            </SearchUserItem>
            <SearchUserItem
                v-for="user in usersSelected"
                :key="user.id"
                @delete="sendAction('removeUser', { userId: user.id })"
            >
                <p>
                    {{ user.firstName || '***' }} {{ user.lastName || `***` }} -
                    {{ user.email || `${t('common.none')} ${t('common.email')}` }}
                </p>
            </SearchUserItem>
        </QList>
    </div>
</template>

<style lang="scss" scoped>
.user-list {
    position: relative;

    .user-spinner {
        position: absolute;
        z-index: 100;
        background-color: var(--color-white);
        opacity: 0.5;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
