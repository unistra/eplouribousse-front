<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import ProjectLibraryCard from '@/components/project/projectStepper/steps/projectLibraries/ProjectLibraryCard.vue'
import ProjectRoles from '@/components/project/projectStepper/steps/projectRoles/ProjectRoles.vue'
import { useProjectAdministration } from '@/components/project/projectAdministration/useProjectAdministration'
import ProjectInformations from '../projectStepper/steps/projectInformations/ProjectInformations.vue'
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { Roles } from '&/project'
import { useI18n } from 'vue-i18n'

const store = useProjectStore()
const { t } = useI18n()
const { tabs } = useProjectAdministration()
const { addingExclusionReason, newExclusionReason, onAddExclusionReason, onCancelAddExclusionReason } =
    useProjectAdministration()
defineProps<{
    tabName: string
}>()

// TODO: mettre la couleur noire uniquement sur le projet sélectionné, les autres en gris
// Et ajouter cette page lors de l'étape "review/validation du projet"
</script>

<template>
    <div
        v-if="tabName === tabs[0].name"
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
                <p>Crée le : {{ new Date(store.createdAt).toLocaleString('fr-FR') }}</p>
                <p>
                    Crée par :
                    <AtomicIcon
                        v-for="(_value, index) in [1, 2, 3]"
                        :key="index"
                        color="grey-900"
                        name="mdi-ghost"
                    />
                    Le monteur de projet (TODO: récupérer le monteur de projet)
                    <AtomicIcon
                        v-for="(_value, index) in [1, 2, 3]"
                        :key="index"
                        color="grey-900"
                        name="mdi-run-fast"
                    />
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
        v-if="tabName === tabs[1].name"
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
        v-if="tabName === tabs[2].name"
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
    <div
        v-if="tabName === tabs[3].name"
        class="space"
    >
        <QCard
            bordered
            flat
        >
            <QCardSection>
                <b>{{ t('project.settings.emailAlert.resourcesAlterts') }}</b>
                <QList>
                    <QItem
                        v-for="key in Object.keys(store.settings.alerts)"
                        :key="key"
                    >
                        <AtomicToggle
                            v-model="
                                //@ts-ignore
                                store.settings.alerts[key as keyof typeof store.settings.alerts]
                            "
                            :label="t(`project.settings.emailAlert.${key}`)"
                            left-label
                        />
                    </QItem>
                </QList>
            </QCardSection>
        </QCard>
    </div>
    <div
        v-if="tabName === tabs[4].name"
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
