<script lang="ts" setup>
import type { UserRoleUser } from '#/project'

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
        clickable
    >
        <QItemSection>
            <!--{{ user.email || 'No email' }}-->
            {{ user.firstName || 'No firstName' }}
            {{ user.lastName || 'No lastName' }} - {{ 'No email' }}
        </QItemSection>
        <QBtn
            v-if="action && action === 'add'"
            :data-testid="dataTestid ? dataTestid : 'add-user-' + user.id"
            @click="emit(`addUser`, user)"
            >+
        </QBtn>
        <QBtn
            v-if="action && action === 'remove'"
            :data-testid="dataTestid ? dataTestid : 'remove-user-' + user.id"
            @click="emit('removeUser', user)"
            >-
        </QBtn>
    </QItem>
</template>
