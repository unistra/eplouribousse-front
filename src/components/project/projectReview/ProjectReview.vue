<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { ref } from 'vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import NewProjectSummary from '@/components/newProject/steps/newProjectSummary/NewProjectSummary.vue'
import ProjectSettings from '@/components/project/projectSettings/ProjectSettings.vue'

const { t } = useI18n()
const store = useProjectStore()
const { notify } = useComposableQuasar()

const settingsMode = ref<boolean>(false)

// const nameEditMode = ref<boolean>(false)
// const onNameOrDescriptionEnter = async () => {
//     const isValid = await store.validateAndProceedTitleAndDescription()
//
//     if (isValid) {
//         notify({
//             type: 'positive',
//             message: t('newProject.steps.informations.updateNameSucceed'),
//         })
//         nameEditMode.value = false
//     } else {
//         notify({
//             type: 'negative',
//             multiLine: true,
//             message: `${t('forms.validation.fieldIsRequired')} ${t('common.or')} ${t('forms.validation.fieldLessThan255').toLowerCase()}`,
//         })
//         store.name = store.initialState.name
//     }
// }
//
// const descriptionEditMode = ref<boolean>(false)
</script>

<template>
    <div>
        <hgroup>
            <template v-if="!settingsMode">
                <h2>{{ t('project.review') }}</h2>
                <AtomicButton
                    icon="mdi-cog"
                    no-border
                    @click="settingsMode = true"
                />
            </template>
            <template v-else>
                <h2>{{ t('project.settings.title') }}</h2>
                <AtomicButton
                    icon="mdi-close"
                    no-border
                    @click="settingsMode = false"
                />
            </template>
        </hgroup>

        <KeepAlive>
            <NewProjectSummary v-if="!settingsMode" />
            <ProjectSettings v-else />
        </KeepAlive>
    </div>
    <!--    <div class="review">-->
    <!--        <hgroup>-->
    <!--            <p class="label">{{ t('project.review') }}</p>-->
    <!--            <h2 v-if="!nameEditMode">-->
    <!--                {{ store.name }}-->
    <!--                <AtomicButton-->
    <!--                    icon="mdi-pencil"-->
    <!--                    no-border-->
    <!--                    @click="nameEditMode = true"-->
    <!--                />-->
    <!--            </h2>-->
    <!--            <AtomicInput-->
    <!--                v-else-->
    <!--                v-model="store.name"-->
    <!--                :label="t('newProject.steps.informations.name')"-->
    <!--                @keyup.enter="onNameOrDescriptionEnter"-->
    <!--            />-->
    <!--        </hgroup>-->
    <!--        <div class="description">-->
    <!--            <p class="label">{{ t('newProject.steps.informations.description') }}</p>-->
    <!--            <div v-if="!descriptionEditMode">-->
    <!--                <p :class="{ 'no-description': !store.description }">-->
    <!--                    {{ store.description || t('newProject.steps.informations.noDescription') }}-->
    <!--                </p>-->
    <!--                <AtomicButton-->
    <!--                    icon="mdi-pencil"-->
    <!--                    no-border-->
    <!--                    @click="descriptionEditMode = true"-->
    <!--                />-->
    <!--            </div>-->
    <!--            <AtomicInput-->
    <!--                v-else-->
    <!--                v-model="store.description"-->
    <!--                :label="t('newProject.steps.informations.description')"-->
    <!--                type="textarea"-->
    <!--                @keyup.enter="onNameOrDescriptionEnter"-->
    <!--            />-->
    <!--        </div>-->
    <!--    </div>-->
</template>

<style lang="sass" scoped>
div
    display: flex
    flex-direction: column
    gap: 1rem
    width: 100%

    hgroup
        display: flex
        justify-content: space-between
        align-items: center
        h2
            font-size: var(--font-size-3xl)

//.review
//    display: flex
//    flex-flow: column nowrap
//    flex-direction: column
//
//    h2
//        font-size: var(--font-size-3xl)
//        margin-left: 2rem
//        display: flex
//        gap: 1rem
//
//    .description
//        > :last-child
//            margin-left: 2rem
//            padding: 1rem
//            background-color: var(--color-neutral-100)
//            border-radius: var(--border-radius)
</style>
