<script setup lang="ts">
import type { User } from '#/user'

defineProps<{
    user: User
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
            :data-testid="'add-user-' + user.id"
            @click="emit(`addUser`, user)"
            >+</QBtn
        >
        <QBtn
            v-if="action && action === 'remove'"
            :data-testid="'remove-user-' + user.id"
            @click="emit('removeUser', user)"
            >-</QBtn
        >
    </QItem>
</template>
