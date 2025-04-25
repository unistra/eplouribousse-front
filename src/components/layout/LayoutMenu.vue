<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const { dark } = useComposableQuasar()
const userStore = useUserStore()
const { tenantConfiguration, userPreferences } = storeToRefs(userStore)
</script>

<template>
    <QBtn
        dense
        flat
        icon="mdi-account-circle-outline"
        round
    >
        <QMenu :class="tenantConfiguration.color">
            <QList>
                <QItem
                    v-close-popup
                    clickable
                    to="/"
                    class="text-white"
                >
                    <QItemSection>
                        {{ t('settings.core') }}
                    </QItemSection>
                </QItem>
                <QSeparator />
                <QToggle
                    class="text-white"
                    :label="t('settings.darkMode')"
                    :model-value="userPreferences.darkMode"
                    @update:model-value="
                        (newDarkMode) => {
                            ;(userPreferences.darkMode = newDarkMode), dark.set(newDarkMode)
                        }
                    "
                />
            </QList>
        </QMenu>
    </QBtn>
</template>

<style scoped></style>
