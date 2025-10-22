<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useUserStore } from '@/stores/userStore.ts'
import { useAuthentication } from '@/composables/useAuthentication.ts'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const { logout } = useAuthentication()

const onLogout = async () => {
    await logout()
    const { addNotify } = useGlobalStore()
    addNotify({
        message: t('logout.success'),
    })
    await router.push({ name: 'login' })
}
</script>

<template>
    <QHeader bordered>
        <RouterLink :to="{ name: 'Home' }">
            <QImg
                :alt="t('layout.header.logo')"
                no-spinner
                src="/img/logo-eplouribousse.png"
            />
        </RouterLink>
        <AtomicButton
            v-if="!userStore.isAuth"
            icon="mdi-login"
            :label="t('auth.login')"
            :to="{ name: 'login' }"
        />
        <AtomicButton
            v-else
            icon="mdi-account-circle-outline"
            :label="`${userStore.user?.firstName} ${userStore.user?.lastName}`"
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
                                {{ userStore.user?.lastName || t('layout.header.account') }}
                            </QItemLabel>
                            <QItemLabel caption>{{ t('layout.header.manageAccount') }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                    <QItem
                        clickable
                        @click="onLogout"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-logout" />
                        </QItemSection>
                        <QItemSection>{{ t('auth.logout') }}</QItemSection>
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
    background-color: var(--color-white)
    color: var(--color-black)

    .q-img
        width: 300px
</style>
