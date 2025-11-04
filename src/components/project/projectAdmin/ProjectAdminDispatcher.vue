<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import ProjectLibraryCard from '@/components/project/projectStepper/steps/projectLibraries/ProjectLibraryCard.vue'
import ProjectRoles from '@/components/project/projectStepper/steps/projectRoles/ProjectRoles.vue'
import { ProjectAdministrationTab, useProjectAdmin } from '@/components/project/projectAdmin/useProjectAdmin.ts'
import ProjectInformations from '../projectStepper/steps/projectInformations/ProjectInformations.vue'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { Roles } from '&/project'
import { useI18n } from 'vue-i18n'
import ProjectAdminAlerts from '@/components/project/projectAdmin/projectAdminAlerts/ProjectAdminAlerts.vue'

const store = useProjectStore()
const { t, locale } = useI18n()
const { addingExclusionReason, newExclusionReason, onAddExclusionReason, onCancelAddExclusionReason } =
    useProjectAdmin()
defineProps<{
    tabName: ProjectAdministrationTab
}>()

// TODO: mettre la couleur noire uniquement sur le projet sélectionné, les autres en gris
// Et ajouter cette page lors de l'étape "review/validation du projet"
</script>

<template>
    <div
        v-if="tabName === ProjectAdministrationTab.Informations"
        class="informations space"
    >
        <QCard
            bordered
            flat
        >
            <QCardSection>
                <ProjectInformations class="space" />
            </QCardSection>
            <QSeparator />
            <QCardSection>
                <p>
                    {{ t('common.createdAt') }}
                    {{
                        new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
                            new Date(store.createdAt),
                        )
                    }}
                    {{ t('common.by') }}
                    {{ store.createdBy['displayName'] || t('common.unknown') }}
                </p>
            </QCardSection>
            <QSeparator />
            <QCardSection>
                <b>Administrateurs</b>
                <ul>
                    <li
                        v-for="(value, index) in store.findUsersByRole(Roles.ProjectAdmin)"
                        :key="index"
                    >
                        {{ value.user.email }}
                    </li>
                </ul>
                <b>Pilotes</b>
                <ul>
                    <li
                        v-for="(value, index) in store.findUsersByRole(Roles.ProjectManager)"
                        :key="index"
                    >
                        {{ value.user.email }}
                    </li>
                </ul>
            </QCardSection>
            <QSeparator />
            <QCardSection>
                <AtomicToggle
                    v-model="store.isPrivate"
                    :label="t('project.settings.privateMode')"
                    left-label
                />
            </QCardSection>
        </QCard>
    </div>
    <div
        v-if="tabName === ProjectAdministrationTab.Libraries"
        class="space"
    >
        <QCard
            bordered
            flat
        >
            <QCardSection class="libraries">
                <ProjectLibraryCard
                    v-for="library in store.libraries"
                    :key="library.id"
                    :library="library"
                />
            </QCardSection>
        </QCard>
    </div>
    <div
        v-if="tabName === ProjectAdministrationTab.Users"
        class="space"
    >
        <QCard
            bordered
            flat
        >
            <QCardSection>
                <ProjectRoles />
            </QCardSection>
        </QCard>
    </div>
    <ProjectAdminAlerts v-if="tabName === ProjectAdministrationTab.Alerts" />
    <div
        v-if="tabName === ProjectAdministrationTab.Exclusions"
        class="space"
    >
        <QCard
            bordered
            flat
        >
            <QCardSection>
                <b class="space">{{ t('project.settings.exclusionReason') }}</b>
                <QSeparator />
                <QList>
                    <QItem
                        v-for="exclusionReason in store.settings.exclusionReasons"
                        :key="exclusionReason"
                    >
                        <p>{{ exclusionReason }}</p>
                        <AtomicButton
                            v-if="!store.isInEditionMode"
                            icon="mdi-close"
                            no-border
                            size="xs"
                            @click="store.removeExclusionReason(exclusionReason)"
                        />
                    </QItem>
                    <QItem>
                        <AtomicButton
                            v-if="!addingExclusionReason"
                            icon="mdi-plus"
                            size="xs"
                            @click="addingExclusionReason = true"
                        />
                        <AtomicInput
                            v-else
                            v-model="newExclusionReason"
                            :label="t('project.settings.exclusionReason')"
                            quick-input
                            @cancel="onCancelAddExclusionReason"
                            @done="onAddExclusionReason"
                        />
                    </QItem>
                </QList>
            </QCardSection>
        </QCard>
    </div>
</template>

<style lang="sass" scoped>
.informations
    display: flex
    flex-direction: column

.libraries
    display: flex;
    flex-direction: row
    justify-content: space-evenly
    gap: 16px;

.space
    padding-top: 2.5vh
    padding-bottom: 2.5vh
</style>
