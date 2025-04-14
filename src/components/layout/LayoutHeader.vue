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
        :class="userStore.tenantConfiguration.color + ' text-white'"
        elevated
    >
        <QToolbar>
            <BaseButton
                class="lt-md"
                dense
                flat
                icon="mdi-menu"
                @click="leftDrawerOpen = !leftDrawerOpen"
            />
            <QToolbarTitle>
                <BaseItem
                    clickable
                    @click="router.push({ name: 'Home' })"
                >
                    Eplouribousse - {{ userStore.tenantConfiguration.tenantName }}
                </BaseItem>
            </QToolbarTitle>
            <div class="gt-md">
                <LayoutNav buttons />
            </div>
            <QSpace />
            <BaseButton
                :label="t('navigation.login')"
                dense
                flat
            />
            <BaseButton
                dense
                flat
                icon="mdi-cog-outline"
                round
            >
                <QMenu>
                    <QList>
                        <BaseItem
                            v-close-popup
                            clickable
                        >
                            <QItemSection>
                                {{ t('settings.core') }}
                            </QItemSection>
                        </BaseItem>
                        <QSeparator />
                        <QToggle
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
