<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useUserStore } from '@/stores/userStore.ts'

const { t } = useI18n()
const { dark } = useComposableQuasar()
const userStore = useUserStore()
</script>

<template>
    <QBtn
        dense
        flat
        icon="mdi-account-circle-outline"
        round
    >
        <QMenu :class="userStore.tenantConfiguration.color">
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
                    :model-value="userStore.userPreferences.darkMode"
                    @update:model-value="
                        (newDarkMode) => {
                            ;(userStore.userPreferences.darkMode = newDarkMode), dark.set(newDarkMode)
                        }
                    "
                />
            </QList>
        </QMenu>
    </QBtn>
</template>

<style scoped></style>
