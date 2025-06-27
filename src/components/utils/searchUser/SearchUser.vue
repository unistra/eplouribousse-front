<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import UserItem from '../userItem/UserItem.vue'
import { useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'
import type { User } from '#/user'
import type { Roles } from '#/project'

const props = defineProps<{
    role: string
    action?: 'add' | 'remove'
    userToInject?: User
    userToExclude?: User
    allowInvitations?: boolean
    inviteFunction?: (email: string, role: Roles, library_id: string) => Promise<void>
    library_id?: string
}>()
const { t } = useI18n()
const emit = defineEmits(['addUser', 'removeUser'])
const { username, matchingUsers, filter, fillUsers, onLoad } = useSearchUser()

watch(
    () => props.userToExclude,
    (user) => {
        if (filter.value === undefined) {
            filter.value = new Set<string>()
        }
        if (user !== undefined) {
            filter.value.add(user.id)
            matchingUsers.value?.remove(user)
            console.log(filter.value)
        }
    },
)

watch(
    () => props.userToInject,
    (user) => {
        if (filter.value === undefined) {
            filter.value = new Set<string>()
        }
        if (user !== undefined) {
            filter.value.delete(user.id)
            if (username.value !== '') {
                matchingUsers.value?.add(user)
            }
        }
    },
)

onMounted(() => {
    matchingUsers.value?.clear()
})

const addInvitation = async () => {
    await props.inviteFunction?.(username.value, 'instructor', props.library_id || '')
    username.value = ''
}
</script>

<template>
    <QInput
        v-model="username"
        clearable
        data-testid="search"
        :label="t('newProject.requirements.email')"
        @clear="(matchingUsers?.clear(), (username = ''))"
        @update:model-value="fillUsers"
    >
        <template #append>
            <QIcon name="mdi-magnify" />
        </template>
    </QInput>
    <QList
        id="scroll"
        class="scroll"
        data-testid="list"
        dense
        style="max-height: 10rem"
    >
        <QItem
            v-if="props.allowInvitations && props.inviteFunction && matchingUsers?.size() === 0 && username.length > 0"
            clickable
        >
            <QItemSection>Invite user with this email: {{ username }}</QItemSection>
            <QBtn @click="addInvitation"> +</QBtn>
        </QItem>
        <QInfiniteScroll
            data-testid="scroll"
            :offset="150"
            scroll-target="#scroll"
            @load="onLoad"
        >
            <!-- @vue-expect-error: i need to check User types with meriadeg -->
            <UserItem
                v-for="(user, index) in matchingUsers?.values()"
                :key="index"
                :action="action"
                :role="role"
                :user="user"
                @add-user="() => emit(`addUser`, { user, role })"
                @remove-user="emit(`removeUser`, { user, role })"
            />
        </QInfiniteScroll>
    </QList>
</template>
