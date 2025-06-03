<script lang="ts" setup>
import { onMounted } from 'vue'
import UserItem from '../userItem/UserItem.vue'
import { useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'

defineProps<{
    role: string
    action?: 'add' | 'remove'
}>()
const { t } = useI18n()
const emit = defineEmits(['addUser', 'removeUser'])
const { username, matchingUsers, fillUsers, onLoad } = useSearchUser()

onMounted(() => {
    matchingUsers.value?.clear()
})
</script>

<template>
    <QInput
        v-model="username"
        data-testid="search"
        :label="t('newProject.requirements.email')"
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
        style="max-height: 150px"
    >
        <QInfiniteScroll
            data-testid="scroll"
            :offset="150"
            scroll-target="#scroll"
            @load="onLoad"
        >
            <UserItem
                v-for="user in matchingUsers?.values()"
                :key="user.id"
                :action="action"
                :role="role"
                :user="user"
                @add-user="() => emit(`addUser`, { user, role })"
                @remove-user="() => emit(`removeUser`, { user, role })"
            />
        </QInfiniteScroll>
    </QList>
</template>
