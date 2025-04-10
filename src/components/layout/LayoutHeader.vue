<script lang="ts" setup>
import BaseButton from '@/components/base/BaseButton.vue'
import { useUsererStore } from '@/stores/userStore'
import LayoutNav from './LayoutNav.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUsererStore()
</script>

<template>
    <QHeader
        elevated
        :class="userStore.tenantConfiguration.color + ' text-white'"
    >
        <QToolbar>
            <QToolbarTitle>Eplouribousse - {{ userStore.tenantConfiguration.tenantName }}</QToolbarTitle>
            <LayoutNav />
            <QSpace />
            <BaseButton
                icon="mdi-cog-outline"
                flat
                round
                dense
            >
                <QMenu
                    ><QList style="min-width: 100px">
                        <QItem
                            clickable
                            v-close-popup
                        >
                            <QItemSection>{{ t('settings.core') }}</QItemSection>
                        </QItem>
                        <QSeparator />
                        <QToggle
                            :model-value="userStore.userPreferences.darkMode"
                            :label="t('settings.darkMode')"
                            @update:model-value="(newDarkMode) => (userStore.userPreferences.darkMode = newDarkMode)"
                        ></QToggle> </QList
                ></QMenu>
            </BaseButton>
        </QToolbar>
    </QHeader>
</template>
