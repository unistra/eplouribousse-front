<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import ProjectInformations from '@/components/project/projectStepper/steps/projectInformations/ProjectInformations.vue'
import ProjectLibraryCard from '@/components/project/projectStepper/steps/projectLibraries/ProjectLibraryCard.vue'
import ProjectRoles from '@/components/project/projectStepper/steps/projectRoles/ProjectRoles.vue'
import { useProjectAdministration } from '@/components/project/projectAdministration/useProjectAdministration'
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import { Roles } from '&/project'
import { useI18n } from 'vue-i18n'

const store = useProjectStore()
const { t } = useI18n()
const { tabs } = useProjectAdministration()
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
        class="libraries space"
    >
        <ProjectLibraryCard
            v-for="library in store.libraries"
            :key="library.id"
            :library="library"
        />
    </div>
    <div
        v-if="tabName === tabs[2].name"
        class="space"
    >
        <ProjectRoles />
    </div>
</template>

<style lang="sass" scoped>
.informations
    display: flex
    flex-direction: column

.libraries
    display: flex;
    flex-wrap: wrap;
    flex-direction: row
    justify-content: space-evenly
    gap: 16px;

.space
    padding-bottom: 30px
</style>
