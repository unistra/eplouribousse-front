<script setup lang="ts">
import { onMounted } from 'vue'
import UserItem from '../userItem/UserItem.vue'
import { useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'
import type { User } from '#/user'

defineProps<{
    role: string
    action?: 'add' | 'remove'
}>()
const { t } = useI18n()
const emit = defineEmits(['addUser', 'removeUser'])
const { username, matchingUsers, fillUsers, onLoad } = useSearchUser()

function removeUserTest(user: User, role: string) {
    console.log('YES')
    emit(`removeUser`, { user, role })
}

onMounted(() => {
    matchingUsers.value?.clear()
})
</script>

<template>
    <QInput
        v-model="username"
        data-testid="search"
        :label="t('newProject.requirements.email')"
        :loading="isLoading"
        type="search"
        @update:model-value="fillUsers"
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
