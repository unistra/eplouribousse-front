<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useLoginForm } from './useLoginForm.ts'
import OrDividerUtils from '@/components/utils/OrDividerUtils.vue'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import { onMounted, ref } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()
const { email, password, isLoading, onLogin } = useLoginForm()
const loginURL = ref<string>('')

onMounted(() => {
    loginURL.value = location.href.split('-pprd.app.unistra.fr')[0].concat('-api-pprd.app.unistra.fr/saml2/login/')
})
</script>

<template>
    <div class="container column medium">
        <AtomicButton
            :href="loginURL"
            :label="t('forms.login.renater')"
            no-caps
        />
    </div>

    <OrDividerUtils />

    <QForm
        class="container column medium"
        @submit.prevent="onLogin"
    >
        <AtomicInput
            v-model="email"
            :label="t('forms.login.email')"
            reactive-rules
            :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
            type="email"
        />
        <PasswordField
            v-model="password"
            :label="t('forms.login.password')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
        />
        <p>
            {{ t('forms.login.forgottenPassword') }} <a href="/send-email"> {{ t('forms.login.clickHere') }}</a>
        </p>

        <div class="container justify-center">
            <AtomicButton
                :label="t('forms.login.submit')"
                :loading="isLoading"
                no-caps
                type="submit"
            />
        </div>
    </QForm>
</template>
