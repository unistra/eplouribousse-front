<script setup lang="ts">
import { onMounted, watch } from 'vue'
import UserItem from '../userItem/UserItem.vue'
import { useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'
import type { User } from '#/user'

const props = defineProps<{
    role: string
    action?: 'add' | 'remove'
    userToInject?: User
    userToExclude?: User
}>()
const { t } = useI18n()
const emit = defineEmits(['addUser', 'removeUser'])
const { username, matchingUsers, filter, fillUsers, onLoad } = useSearchUser()

watch(
    () => props.userToExclude,
    (user) => {
        if (user !== undefined) {
            filter.value.add(user.id)
            matchingUsers.value?.remove(user)
        }
        console.log(filter.value)
    },
)

watch(
    () => props.userToInject,
    (user) => {
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
</script>

<template>
    <QInput
        v-model="username"
        data-testid="search"
        clearable
        :label="t('newProject.requirements.email')"
        @update:model-value="fillUsers"
        @clear="(matchingUsers?.clear(), (username = ''))"
    >
        <template #append>
            <QIcon name="mdi-magnify" />
        </template>
    </QInput>
    <QList
        style="max-height: 150px"
        dense
        class="scroll"
        id="scroll"
        data-testid="list"
    >
        <QInfiniteScroll
            :offset="150"
            data-testid="scroll"
            @load="onLoad"
            scroll-target="#scroll"
        >
            <UserItem
                v-for="(user, index) in matchingUsers?.values()"
                :role="role"
                :action="action"
                :user="user"
                :key="index"
                @add-user="() => emit(`addUser`, { user, role })"
                @remove-user="emit(`removeUser`, { user, role })"
            />
        </QInfiniteScroll>
    </QList>
</template>
