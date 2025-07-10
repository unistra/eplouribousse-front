<script lang="ts" setup>
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'
import NewProjectRequirements from '@/components/newProject/newProjectRequirements/newProjectRequirements.vue'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'

const isRequirementValidated = ref<boolean>(false)
const store = useProjectStore()
store.$reset()
</script>

<template>
    <QPage padding>
        <NewProjectRequirements
            v-if="!isRequirementValidated"
            @validate="isRequirementValidated = true"
        />
        <NewProjectStepper v-else />
    </QPage>
</template>

<style lang="sass" scoped>
.q-page
    display: flex
</style>
