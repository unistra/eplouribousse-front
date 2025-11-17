<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { type ProjectLibrary } from '#/project.ts'
import { useProjectLibraryCard } from '@/components/project/projectStepper/steps/projectLibraries/useProjectLibraryCard.ts'
import ProjectLibraryCollection from '@/components/project/projectStepper/steps/projectLibraries/collections/ProjectLibraryCollection.vue'
import { Roles } from '&/project.ts'
import { storeToRefs } from 'pinia'

const props = defineProps<{
    library: ProjectLibrary
    isSummary?: boolean
}>()

const { t } = useI18n()
const store = useProjectStore()
const { isInEditionMode } = storeToRefs(useProjectStore())

const { onDelete, isLoadingDelete, onAddInvitation, onAddRole, isAddUserLoading, borderColorIsAlternativeStorageSite } =
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
            <p>{{ t('newProject.steps.libraries.instructors') }}</p>
            <SearchUser
                v-if="!isSummary"
                :invitations-selected="
                    store.invitations.filter((el) => el.role === Roles.Instructor && el.libraryId === library.id)
                "
                :is-add-user-loading="isAddUserLoading"
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
            <QList
                v-else
                dense
            >
                <QItem
                    v-for="invitation in store.invitations.filter(
                        (el) => el.role === Roles.Instructor && el.libraryId === library.id,
                    )"
                    :key="invitation.email"
                >
                    📨 {{ invitation.email }}
                </QItem>
                <QItem
                    v-for="user in store.roles
                        .filter((el) => el.role === Roles.Instructor && el.libraryId === library.id)
                        .map((el) => el.user)"
                    :key="user.id"
                >
                    {{ user.firstName || '***' }} {{ user.lastName || `***` }} -
                    {{ user.email || t('utils.noEmailAddress') }}
                </QItem>
            </QList>
        </QCardSection>

        <QCardSection>
            <ProjectLibraryCollection
                v-if="!library.isAlternativeStorageSite"
                :is-summary="isSummary"
                :library-id="library.id"
                :project-id="store.id"
            />
        </QCardSection>

        <QCardActions
            v-if="!isSummary && !isInEditionMode"
            align="right"
        >
            <!-- No alternative storage yet
             <QCheckbox
                :label="t('project.settings.alternativeStorageSite')"
                :model-value="library.isAlternativeStorageSite"
                @update:model-value="store.toggleIsAlternativeStorageSite(props.library)"
            /> -->
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
    flex-direction: column
    gap: 0.5rem
    border: 2px solid v-bind(borderColorIsAlternativeStorageSite)
    border-radius: var(--border-radius)

    .library-name
        font-size: var(--font-size-xl)

    .chip-label-value
        font-size: var(--font-size-sm)
</style>
