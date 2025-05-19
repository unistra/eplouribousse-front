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
        clickable
        :key="user.id"
    >
        <QItemSection>{{ user.email }}</QItemSection>
        <QBtn
            v-if="action && action === 'add'"
            @click="emit(`addUser`, { user, role })"
            >+</QBtn
        >
        <QBtn
            v-if="action && action === 'remove'"
            @click="emit('removeUser', { user, role })"
            >-</QBtn
        >
    </QItem>
</template>
