<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { type SearchUserEmitActions, useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'
import type { ProjectInvitation } from '#/project.ts'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import type { Roles } from '&/project'
import type { UserSummarized } from '#/user.ts'
import ProjectLibraryCardUserList from '@/components/project/libraries/card/ProjectLibraryCardUserList.vue'

const props = defineProps<{
    role?: Roles
    usersSelected: UserSummarized[]
    invitationsSelected: ProjectInvitation[]
    isAddUserLoading: boolean
    preventDeleteCurrentUser?: boolean
    disableInvitations?: boolean
    label?: string
    summaryMode?: boolean
}>()
const { t } = useI18n()
const emit = defineEmits<SearchUserEmitActions>()
const { input, matchingUsers, onLoad, sendAction, clear, isUserListLoading, userAlreadySelected } = useSearchUser(emit)
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
    <div class="search-user">
        <div>
            <p v-if="label">{{ label }}</p>
            <div
                v-if="!summaryMode"
                class="input"
            >
                <AtomicInput
                    v-model="input"
                    clearable
                    dense
                    icon="mdi-magnify"
                    :label="t('utils.searchUser.inputPlaceholder')"
                    :tooltip="t('utils.searchUser.inputPlaceholder')"
                    type="text"
                    @clear="clear"
                />

                <QList
                    v-if="input.length > 0"
                    id="scroll"
                    bordered
                    class="scroll"
                    style="max-height: 10rem"
                >
                    <QItem v-if="matchingUsers?.size() === 0 && input.length > 0 && isUserListLoading === false">
                        <template v-if="disableInvitations">
                            <QItemSection>{{ t('utils.searchUser.noUserFound') }}: {{ input }}</QItemSection>
                        </template>
                        <template v-else>
                            <QItemSection>{{ t('utils.searchUser.inviteText') }}: {{ input }}</QItemSection>
                            <AtomicButton
                                icon="mdi-plus"
                                size="sm"
                                @click="sendAction('addInvitation')"
                            />
                        </template>
                    </QItem>
                    <QInfiniteScroll
                        :offset="150"
                        scroll-target="#scroll"
                        @load="onLoad"
                    >
                        <QItem
                            v-for="user in matchingUsers?.values()"
                            :key="user.id"
                            class="container row"
                            clickable
                            @click="sendAction('addUser', { user: user })"
                        >
                            <QItemSection>
                                {{ user.displayName }}
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
            </div>
        </div>

        <QInnerLoading
            v-if="!summaryMode"
            :showing="isAddUserLoading"
        />
        <ProjectLibraryCardUserList
            :invitations-selected
            :send-action="sendAction"
            :summary-mode
            :users-selected
        />
    </div>
</template>

<style lang="sass" scoped>
.search-user
    position: relative
    display: flex
    flex-direction: column
    gap: 0.5rem
</style>
