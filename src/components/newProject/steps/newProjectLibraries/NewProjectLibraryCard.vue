<script lang="ts" setup>
import type { LibraryI } from '#/library'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import NewProjectLibraryCollection from '@/components/newProject/steps/newProjectLibraries/collections/NewProjectLibraryCollection.vue'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'

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
                :invitations-selected="
                    store.invitations.filter((el) => el.role === 'instructor' && el.library === library.id)
                "
                :users-selected="
                    store.roles
                        .filter((el) => el.role === 'instructor' && el.library === library.id)
                        .map((el) => el.user)
                "
                @add-invitation="async (email) => await store.addInvitation(email, 'instructor', library.id)"
                @add-user="async (userId) => await store.addRole(userId, 'instructor', library.id)"
                @remove-invitation="async ({ email, role }) => await store.removeInvitation(email, role, library.id)"
                @remove-user="async (userId) => await store.removeRole(userId, 'instructor', library.id)"
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
