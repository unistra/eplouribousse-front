<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { type ProjectLibrary } from '#/project.ts'
import { useProjectLibraryCard } from '@/components/project/libraries/card/useProjectLibraryCard.ts'
import ProjectLibraryCollection from '@/components/project/libraries/card/collectionField/ProjectLibraryCollection.vue'
import { ProjectStatus, Roles } from '&/project.ts'
import ProjectLibraryCardUserList from '@/components/project/libraries/card/ProjectLibraryCardUserList.vue'

const props = defineProps<{
    library: ProjectLibrary
    summaryMode?: boolean
}>()

const { t } = useI18n()
const projectStore = useProjectStore()

const { onDelete, isLoadingDelete, onAddInvitation, onAddRole, isAddUserLoading, invitationsSelected, usersSelected } =
    useProjectLibraryCard(props.library)
</script>

<template>
    <QCard flat>
        <QCardSection>
            <p class="library-name">{{ library.name }}</p>
            <QChip class="chip-label-value">
                {{ t('libraries.form.fields.alias') }}: <span>{{ library.alias }} </span>
            </QChip>
            <QChip class="chip-label-value">
                {{ t('libraries.form.fields.code') }}: <span>{{ library.code }}</span>
            </QChip>
        </QCardSection>

        <QCardSection>
            <SearchUser
                v-if="!summaryMode"
                :invitations-selected
                :is-add-user-loading="isAddUserLoading"
                :label="t('view.project.new.stepper.steps.libraries.instructors')"
                :users-selected
                @add-invitation="onAddInvitation"
                @add-user="(user) => onAddRole(user.id)"
                @remove-invitation="
                    async ({ email, role }) => await projectStore.removeInvitation(email, role, library.id)
                "
                @remove-user="async (user) => await projectStore.removeRole(user.id, Roles.Instructor, library.id)"
            />

            <ProjectLibraryCardUserList
                v-else
                :invitations-selected
                summary-mode
                :users-selected
            />
        </QCardSection>

        <QCardSection>
            <ProjectLibraryCollection
                v-if="!library.isAlternativeStorageSite"
                :library-id="library.id"
                :summary-mode="summaryMode"
            />
        </QCardSection>

        <QCardActions
            v-if="!summaryMode && projectStore.status === ProjectStatus.Draft"
            align="right"
        >
            <AtomicButton
                confirm-button-color="negative"
                icon="mdi-delete"
                :loading="isLoadingDelete"
                no-border
                :require-confirmation="true"
                @confirm="onDelete"
            />
        </QCardActions>
    </QCard>
</template>

<style scoped lang="sass">
.q-card
    width: 100%
    max-width: 24rem
    display: flex
    height: fit-content
    flex-direction: column
    gap: 0.5rem
    border: 2px solid var(--color-neutral-200)
    border-radius: var(--border-radius)
.library-name
    font-size: var(--font-size-xl)

.chip-label-value
    font-size: var(--font-size-sm)
</style>
