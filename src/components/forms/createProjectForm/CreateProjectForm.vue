<script setup lang="ts">
import type { User } from '#/user'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const admins = ref<User[]>([])
const pilots = ref<User[]>([])
const controllers = ref<User[]>([])
const name = ref<string>('')

function addUser(value: { user: User; role: string }) {
    switch (value.role) {
        case 'admin':
            admins.value.push(value.user)
            break
        case 'pilot':
            pilots.value.push(value.user)
            break
        case 'controller':
            controllers.value.push(value.user)
            break
    }
}

function removeUserFromArray(value: { user: User; role: string }) {
    switch (value.role) {
        case 'admin':
            admins.value = admins.value.filter((user) => user.id !== value.user.id)
            break
        case 'pilot':
            pilots.value = pilots.value.filter((user) => user.id !== value.user.id)
            break
        case 'controller':
            controllers.value = controllers.value.filter((user) => user.id !== value.user.id)
            break
    }
}
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
            { title: 'Administrateurs', role: 'admin', array: admins },
            { title: 'Pilotes de projet', role: 'pilot', array: pilots },
            { title: 'Controlleurs', role: 'controller', array: controllers },
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
            <QCardSection class="col-4">
                <QScrollArea style="min-height: 100px">
                    <UserItem
                        v-for="user in section.array"
                        action="remove"
                        style="min-width: 70px"
                        :key="user.id"
                        :role="section.role"
                        :user="user"
                        @remove-user="removeUserFromArray"
                    />
                </QScrollArea>
            </QCardSection>
        </QCardSection>
    </QCard>
</template>
