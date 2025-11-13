<script lang="ts" setup>
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import type { UserSummarized } from '#/user.ts'

defineProps<{
    user: UserSummarized
    dataTestid?: string
    action?: 'add' | 'remove'
}>()

const emit = defineEmits(['addUser', 'removeUser'])
</script>

<template>
    <QItem
        :key="user.id"
        class="container row"
        :clickable="action === 'add'"
        @click="emit(`addUser`, user)"
    >
        <QItemSection>
            <!--{{ user.email || 'No email' }}-->
            {{ user.firstName || 'No firstName' }}
            {{ user.lastName || 'No lastName' }} - {{ 'No email' }}
        </QItemSection>
        <AtomicButton
            v-if="action && action === 'remove'"
            :data-testid="dataTestid ? dataTestid : 'remove-user-' + user.id"
            flat
            icon="mdi-close"
            size="sm"
            @click="emit('removeUser', user)"
        />
    </QItem>
</template>
