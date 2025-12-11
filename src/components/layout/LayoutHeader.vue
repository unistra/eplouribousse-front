<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useUserStore } from '@/stores/userStore.ts'

const { t } = useI18n()
const userStore = useUserStore()
</script>

<template>
    <QHeader bordered>
        <RouterLink :to="{ name: 'home' }">
            <QImg
                :alt="t('views.layout.header.logoAlt')"
                no-spinner
                src="/img/logo-eplouribousse.png"
            />
        </RouterLink>
        <AtomicButton
            v-if="!userStore.isAuth"
            icon="mdi-login"
            :label="t('common.login')"
            :to="{ name: 'login' }"
        />
        <AtomicButton
            v-else
            icon="mdi-account-circle-outline"
            :label="userStore.user?.displayName"
            no-border
        >
            <QMenu>
                <QList>
                    <QItem
                        class="account"
                        clickable
                        :to="{ name: 'account' }"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-cog" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>
                                {{ userStore.user?.firstName || '' }}
                                {{ userStore.user?.lastName || t('common.myAccount') }}
                            </QItemLabel>
                            <QItemLabel caption>{{ t('views.layout.header.manageAccount') }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                    <QItem
                        clickable
                        :to="{ name: 'logout' }"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-logout" />
                        </QItemSection>
                        <QItemSection>{{ t('common.logout') }}</QItemSection>
                    </QItem>
                </QList>
            </QMenu>
        </AtomicButton>
    </QHeader>
</template>

<style scoped lang="sass">
.q-header
    display: flex
    justify-content: space-between
    padding: 1rem
    background-color: var(--layout-header-bg-color)
    color: var(--layout-header-color)

    .q-img
        width: 300px
</style>
