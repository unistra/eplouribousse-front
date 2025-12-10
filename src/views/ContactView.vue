<script lang="ts" setup>
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import { ContactObjects, ContactObjectsLabels } from '&/other.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'

const { t } = useI18n()
const userStore = useUserStore()
const { useHandleError } = useUtils()

const contactObjects = Object.values(ContactObjects)
const subject = ref<string>('')
const message = ref<string>('')
const messageMaxLengthValidation = 1000
const email = ref<string>('')
const confirmEmail = ref<string>('')
const messageSent = ref<boolean>(false)

const loading = ref<boolean>(false)

const onSubmit = async () => {
    loading.value = true
    try {
        const response = await axiosI.post('/contact/support/', {
            ...(!userStore.user && { email: email.value }),
            subject: subject.value,
            message: message.value,
        })

        if (response.status === 201) messageSent.value = true
    } catch (e) {
        useHandleError(e)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <QPage padding>
        <h1>{{ t('views.contact.title') }}</h1>
        <QForm
            v-if="!messageSent"
            class="auth-form"
            @submit.prevent="onSubmit"
        >
            <AtomicSelect
                v-model="subject"
                emit-value
                hide-bottom-space
                :label="t('views.contact.subjects.i')"
                map-options
                :option-label="(val: ContactObjects) => (val ? ContactObjectsLabels[val] : '')"
                :options="contactObjects"
                required
                :rules="[(val) => !!val || t('errors.form.fieldIsRequired')]"
            />
            <AtomicInput
                v-model="message"
                hide-bottom-space
                :label="t('views.contact.placeholder')"
                :rules="[
                    (val: string) =>
                        val.length <= messageMaxLengthValidation ||
                        t('errors.form.maxLength', { length: messageMaxLengthValidation }),
                ]"
                type="textarea"
            />
            <template v-if="!userStore.user?.email">
                <AtomicInput
                    v-model="email"
                    hide-bottom-space
                    :label="t('common.emailAddress')"
                    :rules="[(val, rules) => rules.email(val) || t('errors.form.validEmail')]"
                    :skeleton="userStore.userLoading"
                    type="email"
                />
                <AtomicInput
                    v-model="confirmEmail"
                    hide-bottom-space
                    :label="t('views.contact.confirmEmail')"
                    :rules="[(val: string) => val === email || t('errors.form.fieldsMustMatch')]"
                    type="email"
                />
            </template>
            <AtomicButton
                :label="t('common.send')"
                :loading
                type="submit"
            />
        </QForm>
        <div v-else>
            <QIcon
                color="positive"
                name="mdi-check"
                size="xl"
            />
            <p>{{ t('views.contact.messageSent') }}</p>
        </div>
    </QPage>
</template>

<style lang="sass" scoped>
main
    display: flex
    flex-direction: column
    gap: 1rem
    align-items: center

    > div
        display: flex
        align-items: center
        gap: 1rem

        p
            font-size: var(--font-size-xl)
</style>
