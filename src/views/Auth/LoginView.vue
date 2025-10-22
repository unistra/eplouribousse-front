<script lang="ts" setup>
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import { useLoginForm } from '@/components/forms/auth/loginForm/useLoginForm.ts'

const globalStore = useGlobalStore()
const { t } = useI18n()

const { email, password, isLoading, onLogin, saml2URL } = useLoginForm()

onMounted(() => {
    globalStore.showNotify()
    saml2URL.value = new URL('/saml2/login/', globalStore.backendBaseURL).toString()
})
</script>

<template>
    <QPage padding>
        <h1>{{ t('auth.login.i') }}</h1>

        <div class="container">
            <div class="shibboleth">
                <h2>{{ t('auth.login.authShibboleth') }}</h2>
                <AtomicButton
                    color="primary"
                    :href="saml2URL"
                    :label="t('auth.login.i')"
                />
            </div>

            <div class="or-divider">
                <QSeparator />
                <p>{{ t('common.or') }}</p>
                <QSeparator />
            </div>

            <QForm @submit.prevent="onLogin">
                <h2>{{ t('auth.login.authLocal') }}</h2>
                <div class="inputs">
                    <AtomicInput
                        v-model="email"
                        :label="t('common.email')"
                        reactive-rules
                        :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
                        type="email"
                    />
                    <div class="password">
                        <PasswordField
                            v-model="password"
                            :label="t('common.password')"
                            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
                        />
                        <RouterLink :to="{ name: 'requestPasswordReset' }">
                            {{ t('forms.login.forgottenPassword') }}
                        </RouterLink>
                    </div>
                </div>

                <AtomicButton
                    :label="t('auth.login.i')"
                    :loading="isLoading"
                    no-caps
                    type="submit"
                />
            </QForm>
        </div>
    </QPage>
</template>

<style scoped lang="sass">
main
    display: flex
    flex-direction: column
    gap: 4rem

h1
    font-size: 1.5rem
    font-weight: bold

h2
    font-size: 1.3rem

.container
    display: flex
    flex-direction: column
    gap: 3rem
    justify-content: center
    align-items: center

    .shibboleth
        display: flex
        flex-direction: column
        align-items: center
        gap: 1rem

        .q-btn
            width: 100%
            max-width: 16rem

    .or-divider
        display: flex
        justify-content: center
        align-items: center
        gap: 1rem
        width: 100%
        max-width: 16rem

        .q-separator
            width: 100%


    .q-form
        display: flex
        flex-direction: column
        gap: 1.5rem
        align-items: center

        .inputs
            display: flex
            flex-direction: column
            gap: 0.5rem
            width: 100%

            .password
                display: flex
                flex-direction: column
                > :last-child
                    align-self: end

        .q-btn
            width: 100%
            max-width: 16rem
</style>
