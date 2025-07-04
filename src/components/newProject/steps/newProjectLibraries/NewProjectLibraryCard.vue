<script lang="ts" setup>
import type { LibraryI } from '#/library'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import NewProjectLibraryCollection from '@/components/newProject/steps/newProjectLibraries/collections/NewProjectLibraryCollection.vue'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useNewProjectLibraryCard } from '@/components/newProject/steps/newProjectLibraries/useNewProjectLibraryCard.ts'

const props = defineProps<{
    library: LibraryI
}>()

const { t } = useI18n()
const store = useProjectStore()

const { onDelete, isLoadingDelete, onAddInvitation, onAddRole, isAddUserLoading } = useNewProjectLibraryCard(
    props.library,
)
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
                    store.invitations.filter((el) => el.role === 'instructor' && el.libraryId === library.id)
                "
                :is-add-user-loading="isAddUserLoading"
                :users-selected="
                    store.roles
                        .filter((el) => el.role === 'instructor' && el.libraryId === library.id)
                        .map((el) => el.user)
                "
                @add-invitation="onAddInvitation"
                @add-user="onAddRole"
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
            <AtomicButton
                confirm-button-color="red"
                icon="mdi-delete"
                :loading="isLoadingDelete"
                no-border
                :require-confirmation="true"
                @confirm="onDelete"
            />
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
