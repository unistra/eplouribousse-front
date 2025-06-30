<script lang="ts" setup>
import type { LibraryI } from '#/library'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import type { UserRoleUser } from '#/project'
import NewProjectLibraryCollection from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraryCollection.vue'

defineProps<{
    library: LibraryI
}>()

const { t } = useI18n()
const store = useProjectStore()
</script>

<template>
    <QCard
        class="base-card library-card"
        flat
    >
        <QCardSection>
            <p>{{ library.name }}</p>
            <p>{{ library.alias }}</p>
            <p>{{ library.code }}</p>
        </QCardSection>

        <QCardSection>
            <p>{{ t('newProject.steps.libraries.instructors') }}</p>
            <SearchUser
                action="add"
                :allow-invitations="true"
                :invite-function="store.addInvitation"
                :library_id="library.id"
                :role="t('newProject.steps.libraries.instructors')"
                @add-user="({ user }) => store.addInstructor(user.id, library.id)"
            />
            <template v-if="Array.isArray(store.invitations)">
                <QItem
                    v-for="(invitation, index) in store.invitations.filter(
                        (el) => el.role === 'instructor' && el.library === library.id,
                    )"
                    :key="index"
                >
                    <QItemSection>
                        <!--{{ user.email || 'No email' }}-->
                        {{ invitation.email }} (invitation)
                    </QItemSection>
                    <QBtn @click="() => store.removeInvitation(invitation.email, 'instructor', library.id)"> - </QBtn>
                </QItem>
            </template>
            <UserItem
                v-for="(userRole, index) in store.roles.filter(
                    (el) => el.role === 'instructor' && el.library === library.id,
                )"
                :key="index"
                action="remove"
                :user="userRole.user"
                @remove-user="(user: UserRoleUser) => store.removeInstructor(user.id, library.id)"
            />
        </QCardSection>

        <QCardSection>
            <NewProjectLibraryCollection
                :library-id="library.id"
                :project-id="store.id"
            />
        </QCardSection>

        <QCardActions align="right">
            <!--TODO: ADD DELETE CONFIRMATION-->
            <QBtn
                flat
                @click="() => store.removeLibrary(library)"
            >
                <QIcon name="mdi-delete" />
            </QBtn>
        </QCardActions>
    </QCard>
</template>

<style scoped>
.q-card {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 4px solid #e4e4e4;
}
</style>
