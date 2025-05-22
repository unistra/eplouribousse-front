<script setup lang="ts">
import { useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { username, matchingUsers, isLoading, nextPage, fillUsers, appendUsers } = useSearchUser()
</script>

<template>
    <QInput
        v-model="username"
        type="search"
        :loading="isLoading"
        :label="t('newProject.requirements.email')"
        @update:model-value="fillUsers"
    >
        <template #append>
            <QIcon name="mdi-magnify" />
        </template>
    </QInput>
    <QList dense>
        <QScrollArea style="height: 200px">
            <QItem
                v-for="user in matchingUsers"
                :key="user.id"
                clickable
            >
                <QItemSection>{{ user.username }}</QItemSection>
            </QItem>
        </QScrollArea>
        <QBtn
            v-if="matchingUsers.length >= 10 && nextPage !== null"
            icon="mdi-plus-circle-outline"
            rounded
            flat
            @click="appendUsers"
        />
    </QList>
</template>
