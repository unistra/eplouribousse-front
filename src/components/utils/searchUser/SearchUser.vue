<script setup lang="ts">
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
        :loading="isLoading"
        type="search"
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
            :offset="148"
            scroll-target="#scroll"
            @load="onLoad"
        >
            <UserItem
                v-for="user in matchingUsers"
                :key="user.id"
                :action="action"
                :role="role"
                :user="user"
                @add-user="() => emit(`addUser`, { user, role })"
                @remove-user="() => emit(`removeUser`, { user, role })"
            />
            <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <QSpinnerDots
                        color="primary"
                        size="40px"
                    />
                </div>
            </template>
        </QInfiniteScroll>
    </QList>
</template>
