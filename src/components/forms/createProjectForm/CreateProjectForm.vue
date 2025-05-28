<script setup lang="ts">
import type { User } from '#/user'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import { useI18n } from 'vue-i18n'
import { useCreateProjectForm } from './useCreateProjectForm'

const { t } = useI18n()
const { admins, pilots, controllers, name, addUser, removeUser } = useCreateProjectForm()
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
            { title: 'Administrateurs', role: 'admin', array: admins.values() },
            { title: 'Pilotes de projet', role: 'pilot', array: pilots.values() },
            { title: 'Controlleurs', role: 'controller', array: controllers.values() },
        ]"
        :key="section.title"
    >
        <QItem>
            <QItemSection>
                <QItemLabel style="text-align: center">{{ section.title }}</QItemLabel>
            </QItemSection>
        </QItem>

        <QSeparator />

        <QCardSection horizontal>
            <QCardSection class="col-8">
                <SearchUser
                    action="add"
                    :role="section.role"
                    @add-user="addUser"
                />
            </QCardSection>
            <QSeparator vertical />
            <QCardSection
                class="col-4"
                :data-testid="section.role + '-list'"
            >
                <p style="text-align: center">{{ t('newProject.creation.userToAdd') }}</p>
                <QScrollArea style="min-height: 10rem">
                    <UserItem
                        v-for="user in section.array"
                        action="remove"
                        style="min-width: 4rem"
                        :key="user.id"
                        :role="section.role"
                        :user="user"
                        @remove-user="removeUser"
                    />
                </QScrollArea>
            </QCardSection>
        </QCardSection>
    </QCard>
</template>
