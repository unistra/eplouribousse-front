<script setup lang="ts">
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import { useI18n } from 'vue-i18n'
import { useCreateProjectForm } from './useCreateProjectForm'

const { t } = useI18n()
const { userToExclude, userToInject, name, addUser, removeUser, getUsersByRole } = useCreateProjectForm()
</script>

<template>
    <QCard
        bordered
        class="margin-b1"
    >
        <QCardSection>
            <QInput
                type="text"
                v-model="name"
                :label="t('newProject.creation.name')"
            />
        </QCardSection>
    </QCard>
    <QCard
        bordered
        v-for="section in [
            { title: 'Administrateurs', role: 'admin' },
            { title: 'Pilotes de projet', role: 'pilot' },
            { title: 'Controlleurs', role: 'controller' },
        ]"
        :key="section.title"
    >
        <QItem>
            <QItemSection>
                <QItemLabel style="text-align: center">{{ section.title }}</QItemLabel>
            </QItemSection>
        </QItem>

        <QSeparator />

        <QCardSection
            horizontal
            :data-testid="'list-' + section.role"
        >
            <QCardSection class="col-8">
                <SearchUser
                    action="add"
                    :role="section.role"
                    :user-to-exclude="userToExclude"
                    :user-to-inject="userToInject"
                    @add-user="addUser"
                />
            </QCardSection>
            <QSeparator vertical />
            <QCardSection
                class="col-4"
                :data-testid="'users-' + section.role"
            >
                <p style="text-align: center">{{ t('newProject.creation.userToAdd') }}</p>
                <QScrollArea style="min-height: 10rem">
                    <UserItem
                        v-for="user in getUsersByRole(section.role)"
                        action="remove"
                        style="min-width: 4rem"
                        :key="user.id"
                        :user="user"
                        @remove-user="removeUser"
                    />
                </QScrollArea>
            </QCardSection>
        </QCardSection>
    </QCard>
</template>
