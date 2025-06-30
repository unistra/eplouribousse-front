<script lang="ts" setup>
import type { ImportCSVResponse } from '#/project'
import { useI18n } from 'vue-i18n'

defineProps<{
    response: ImportCSVResponse | null
}>()

const modal = defineModel<boolean>()
const { t } = useI18n()
</script>

<template>
    <QDialog
        v-model="modal"
        persistent
    >
        <QCard>
            <QCardSection>
                <p>{{ t('newProject.steps.libraries.collection.importSuccess') }}</p>
                <p>{{ t('newProject.steps.libraries.collection.weFound') }}:</p>
            </QCardSection>
            <QCardSection>
                <p
                    v-for="(count, key) in response"
                    :key="key"
                >
                    {{ count }} {{ t('newProject.steps.libraries.collection.elementPresent') }}
                    {{ key + ' ' + t('newProject.steps.libraries.collection.times') }}
                </p>
            </QCardSection>

            <QCardActions vertical>
                <QBtn @click="modal = false">Continuer</QBtn>
            </QCardActions>
        </QCard>
    </QDialog>
</template>

<style scoped></style>
