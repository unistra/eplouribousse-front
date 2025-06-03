<script setup lang="ts">
import type { User } from '#/user'

defineProps<{
    user: User
    role: string
    action?: 'add' | 'remove'
}>()

const emit = defineEmits(['addUser', 'removeUser'])
</script>

<template>
    <QItem
        :key="user.id"
        clickable
    >
        <QItemSection>{{ user.email }}</QItemSection>
        <QBtn
            v-if="action && action === 'add'"
            :data-testid="'add-user-' + user.id"
            @click="emit(`addUser`, { user, role })"
            >+</QBtn
        >
        <QBtn
            v-if="action && action === 'remove'"
            :data-testid="'remove-user-' + user.id"
            @click="emit('removeUser', { user, role })"
            >-</QBtn
        >
    </QItem>
</template>
