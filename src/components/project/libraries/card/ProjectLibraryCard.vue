<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { type ProjectLibrary } from '#/project.ts'
import { useProjectLibraryCard } from '@/components/project/libraries/card/useProjectLibraryCard.ts'
import ProjectLibraryCollection from '@/components/project/libraries/card/collectionField/ProjectLibraryCollection.vue'
import { Roles } from '&/project.ts'

const props = defineProps<{
    library: ProjectLibrary
    isSummary?: boolean
}>()

const { t } = useI18n()
const store = useProjectStore()

const { onDelete, isLoadingDelete, onAddInvitation, onAddRole, isAddUserLoading } = useProjectLibraryCard(props.library)
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
                v-if="!isSummary"
                :invitations-selected="
                    store.invitations.filter((el) => el.role === Roles.Instructor && el.libraryId === library.id)
                "
                :is-add-user-loading="isAddUserLoading"
                :label="t('view.project.new.stepper.steps.libraries.instructors')"
                :users-selected="
                    store.roles
                        .filter((el) => el.role === Roles.Instructor && el.libraryId === library.id)
                        .map((el) => el.user)
                "
                @add-invitation="onAddInvitation"
                @add-user="(user) => onAddRole(user.id)"
                @remove-invitation="async ({ email, role }) => await store.removeInvitation(email, role, library.id)"
                @remove-user="async (user) => await store.removeRole(user.id, Roles.Instructor, library.id)"
            />
        </QCardSection>

        <QCardSection>
            <ProjectLibraryCollection
                v-if="!library.isAlternativeStorageSite"
                :library-id="library.id"
                :summary-mode="isSummary"
            />
        </QCardSection>

        <QCardActions
            v-if="!isSummary"
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
.library-name
    font-size: var(--font-size-xl)

.chip-label-value
    font-size: var(--font-size-sm)
</style>
