<script lang="ts" setup>
import type { UserRoleUser } from '#/project'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

defineProps<{
    user: UserRoleUser
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
        <QItemSection>
            <!--{{ user.email || 'No email' }}-->
            {{ user.firstName || 'No firstName' }}
            {{ user.lastName || 'No lastName' }} - {{ 'No email' }}
        </QItemSection>
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
