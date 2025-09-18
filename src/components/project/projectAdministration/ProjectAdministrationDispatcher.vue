<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import ProjectInformations from '../projectStepper/steps/projectInformations/ProjectInformations.vue'
import { useProjectAdministration } from './useProjectAdministration'
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
                        color="grey-900"
                        name="mdi-incognito"
                    />
                    On sait pas encore (TODO: récupérer le monteur de projet)
                    <AtomicIcon
                        color="grey-900"
                        name="mdi-incognito"
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
</template>

<style lang="sass" scoped>
.informations
    display: flex
    flex-direction: column

.space
    padding-bottom: 30px
</style>
