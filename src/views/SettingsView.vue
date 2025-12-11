<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
</script>

<template>
    <QPage padding>
        <div class="container-center">
            <h1>{{ t('views.settings.core') }}</h1>
        </div>
        <div
            v-if="userStore.isAuth && userStore?.user?.canAuthenticateLocally"
            class="row"
        >
            <div class="col-4">
                <h4>{{ t('views.settings.account') }}</h4>
                <br />
                <ul>
                    <li>
                        <RouterLink :to="{ name: 'changePassword' }"
                            >{{ t('views.settings.changePassword') }}
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </QPage>
</template>
