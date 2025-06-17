<script setup lang="ts">
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import { useI18n } from 'vue-i18n'
import { useCreateProjectForm } from './useNewProjectUsers'

const { t } = useI18n()
const { userToExclude, userToInject, name, addUser, removeUser, getUsersByRole } = useCreateProjectForm()
</script>

<template>
    <div class="container">
        <div
            v-for="section in [
                { title: 'Administrateurs', role: 'admin' },
                { title: 'Pilotes de projet', role: 'pilot' },
                { title: 'Controlleurs', role: 'controller' },
            ]"
            :key="section.title"
            class="container-item base"
        >
            <QCard bordered>
                <QItem>
                    <QItemSection>
                        <QItemLabel style="text-align: left">{{ section.title }}</QItemLabel>
                    </QItemSection>
                </QItem>

                <QSeparator />

                <QCardSection
                    :data-testid="'list-' + section.role"
                    horizontal
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
                                :key="user.id"
                                action="remove"
                                :data-testid="section.role + '-user-remove-' + user.id"
                                style="min-width: 4rem"
                                :user="user"
                                @remove-user="removeUser"
                            />
                        </QScrollArea>
                    </QCardSection>
                </QCardSection>
            </QCard>
        </div>
    </div>
</template>
