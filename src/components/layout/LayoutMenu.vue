<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const { dark } = useComposableQuasar()
const userStore = useUserStore()
const { userPreferences, tenantColor } = storeToRefs(userStore)

function updateDarkMode(darkMode: boolean) {
    userPreferences.value.darkMode = darkMode
    dark.set(darkMode)
    localStorage.setItem('darkMode', darkMode.toString())
}
</script>

<template>
    <QBtn
        dense
        flat
        icon="mdi-account-circle-outline"
        round
    >
        <QMenu :style="tenantColor">
            <QList>
                <QItem
                    v-close-popup
                    clickable
                    class="text-white"
                    :to="{ name: 'settings' }"
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
                    @update:model-value="updateDarkMode"
                />
            </QList>
        </QMenu>
    </QBtn>
</template>
