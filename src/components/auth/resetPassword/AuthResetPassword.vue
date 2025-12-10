<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthResetPassword } from './useAuthResetPassword.ts'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
const { t } = useI18n()

const {
    newPassword,
    confirmPassword,
    token,
    uidb64,
    isLoading,
    isPasswordStrongEnough,
    arePasswordsMatching,
    resetPassword,
} = useAuthResetPassword()

onMounted(() => {
    const route = useRoute()
    if (route.query?.token) token.value = route.query.token as string
    if (route.query?.uidb64) uidb64.value = route.query.uidb64 as string
})
</script>

<template>
    <QForm
        class="auth-form"
        @submit.prevent="resetPassword"
    >
        <PasswordField
            v-model="newPassword"
            :label="t('views.auth.password.new')"
            :linear-progress="true"
            :rules="[() => isPasswordStrongEnough || t('errors.form.password.requirements')]"
        />

        <PasswordField
            v-model="confirmPassword"
            :label="t('views.auth.password.confirm.new')"
            :rules="[() => arePasswordsMatching || t('errors.form.password.doesNotMatch')]"
        />

        <div class="infos">
            <p>{{ t('views.auth.password.instructions.1') }}</p>
            <p>{{ t('views.auth.password.instructions.2') }}</p>
            <p>{{ t('views.auth.password.instructions.3') }}</p>
        </div>
        <AtomicButton
            :label="t('views.auth.password.reset')"
            :loading="isLoading"
            type="submit"
        />
    </QForm>
</template>
<style lang="sass" scoped>
.infos
    font-size: var(--font-size-sm)
</style>
