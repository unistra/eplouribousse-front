<script lang="ts" setup>
import BaseButton from '@/components/base/BaseButton.vue'
import { useUsererStore } from '@/stores/userStore'
import LayoutNav from './LayoutNav.vue'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar'
import router from '@/router'
import BaseItem from '../base/BaseItem.vue'
import { ref } from 'vue'

const { t } = useI18n()
const userStore = useUsererStore()
const { dark } = useComposableQuasar()

const leftDrawerOpen = ref<boolean>(false)
</script>

<template>
    <QHeader
        elevated
        :class="userStore.tenantConfiguration.color + ' text-white'"
    >
        <QToolbar>
            <BaseButton
                class="lt-md"
                icon="mdi-menu"
                flat
                dense
                @click="leftDrawerOpen = !leftDrawerOpen"
            />
            <QToolbarTitle
                ><BaseItem
                    clickable
                    @click="router.push({ name: 'Home' })"
                    >Eplouribousse - {{ userStore.tenantConfiguration.tenantName }}
                </BaseItem>
            </QToolbarTitle>
            <div class="gt-md">
                <LayoutNav buttons />
            </div>
            <QSpace />
            <BaseButton
                flat
                dense
                :label="t('navigation.login')"
            ></BaseButton>
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
    <QDrawer
        v-model="leftDrawerOpen"
        bordered
        side="left"
    >
        <QList>
            <LayoutNav />
        </QList>
    </QDrawer>
</template>
