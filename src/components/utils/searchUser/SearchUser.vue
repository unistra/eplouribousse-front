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
const { username, matchingUsers, isLoading, nextPage, fillUsers, appendUsers } = useSearchUser()

/* eslint-disable */
function onLoad(_index: number, done: any) {
    if (matchingUsers.value?.size && matchingUsers.value.size >= 10 && nextPage.value !== null) {
        isLoading.value = true
        appendUsers()
        done()
    } else {
        done()
    }
}
/* eslint-enable */

onMounted(() => {
    matchingUsers.value?.clear()
})
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
    <QList
        style="max-height: 150px"
        dense
        class="scroll"
        id="scroll"
    >
        <QInfiniteScroll
            :offset="148"
            @load="onLoad"
            scroll-target="#scroll"
        >
            <UserItem
                v-for="(user, index) in matchingUsers"
                :role="role"
                :action="action"
                :user="user"
                :key="index"
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
