<script setup lang="ts">
import type { User } from '#/user'
import UserItem from '../userItem/UserItem.vue'
import { useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'

defineProps<{
    role: string
    action?: 'add' | 'remove'
}>()
const { t } = useI18n()
const emit = defineEmits(['addUser', 'removeUser'])
const { username, matchingUsers, isLoading, nextPage, fillUsers, appendUsers } = useSearchUser()
</script>

<template>
    <QInput
        v-model="username"
        :label="t('newProject.requirements.email')"
        :loading="isLoading"
        type="search"
        @update:model-value="fillUsers"
    >
        <template #append>
            <QIcon name="mdi-magnify" />
        </template>
    </QInput>
    <QList dense>
        <QScrollArea style="min-height: 150px">
            <UserItem
                v-for="user in matchingUsers"
                :key="user.id"
                :action="action"
                :role="role"
                :user="user"
                @add-user="() => emit(`addUser`, { user, role })"
                @remove-user="() => emit(`removeUser`, { user, role })"
            />
        </QScrollArea>
        <QBtn
            v-if="matchingUsers.length >= 10 && nextPage !== null"
            flat
            icon="mdi-plus-circle-outline"
            rounded
            @click="appendUsers"
        />
    </QList>
</template>
