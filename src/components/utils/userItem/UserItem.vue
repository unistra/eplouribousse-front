<script setup lang="ts">
import type { User } from '#/user'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

defineProps<{
    user: User
    dataTestid?: string
    action?: 'add' | 'remove'
}>()

const emit = defineEmits(['addUser', 'removeUser'])
</script>

<template>
    <QItem
        :key="user.id"
        class="container row"
        clickable
    >
        <QItemSection>{{ user.email }}</QItemSection>
        <AtomicButton
            v-if="action && action === 'add'"
            :data-testid="dataTestid ? dataTestid : 'add-user-' + user.id"
            label="+"
            @click="emit(`addUser`, user)"
        />
        <AtomicButton
            v-if="action && action === 'remove'"
            :data-testid="dataTestid ? dataTestid : 'remove-user-' + user.id"
            label="-"
            @click="emit('removeUser', user)"
        />
    </QItem>
</template>
