<script lang="ts" setup>
import BaseButton from '@/components/base/BaseButton.vue'
import { useUsererStore } from '@/stores/userStore'
import LayoutNav from './LayoutNav.vue'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar'
import router from '@/router'
import BaseItem from '../base/BaseItem.vue'

const { t } = useI18n()
const userStore = useUsererStore()

const { dark } = useComposableQuasar()
</script>

<template>
    <QHeader
        elevated
        :class="userStore.tenantConfiguration.color + ' text-white'"
    >
        <QToolbar>
            <QToolbarTitle
                ><BaseItem
                    clickable
                    @click="router.push({ name: 'Home' })"
                    >Eplouribousse - {{ userStore.tenantConfiguration.tenantName }}
                </BaseItem>
            </QToolbarTitle>
            <LayoutNav />
            <QSpace />
            <BaseButton
                icon="mdi-cog-outline"
                flat
                round
                dense
            >
                <QMenu
                    ><QList>
                        <BaseItem
                            clickable
                            v-close-popup
                        >
                            <QItemSection>{{ t('settings.core') }}</QItemSection>
                        </BaseItem>
                        <QSeparator />
                        <QToggle
                            :model-value="userStore.userPreferences.darkMode"
                            :label="t('settings.darkMode')"
                            @update:model-value="
                                (newDarkMode) => {
                                    ;(userStore.userPreferences.darkMode = newDarkMode), dark.set(newDarkMode)
                                }
                            "
                        ></QToggle> </QList
                ></QMenu>
            </BaseButton>
        </QToolbar>
    </QHeader>
</template>
