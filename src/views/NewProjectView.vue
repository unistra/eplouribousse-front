<script lang="ts" setup>
import ProjectStepper from '@/components/project/projectStepper/ProjectStepper.vue'
import ProjectRequirements from '@/components/project/projectRequirements/ProjectRequirements.vue'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'

const isRequirementValidated = ref<boolean>(false)
const store = useProjectStore()
store.$reset()
</script>

<template>
    <QPage padding>
        <ProjectRequirements
            v-if="!isRequirementValidated"
            @validate="isRequirementValidated = true"
        />
        <ProjectStepper v-else />
    </QPage>
</template>

<style lang="sass" scoped>
.q-page
    display: flex
</style>
