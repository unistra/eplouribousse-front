<script setup lang="ts">
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import { computed, onMounted, reactive, ref } from 'vue'

const { t } = useI18n()
const userStore = useUserStore()

const tenantRole = computed(() => {
    return userStore.user?.isProjectCreator ? t('roles.projectCreator') : ''
})

const nameDialog = ref<boolean>(false)
const emailDialog = ref<boolean>(false)

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
})

const resetForm = () => {
    form.firstName = userStore.user?.firstName || ''
    form.lastName = userStore.user?.lastName || ''
    form.email = userStore.user?.email || ''
}

const onNameSubmit = () => {
    // handle save logic
}
const onEmailSubmit = () => {
    // handle save logic
}

const onCancel = () => {
    nameDialog.value = false
    emailDialog.value = false
}

onMounted(async () => {
    resetForm()
})
</script>

<template>
    <div class="block-identity">
        <p>
            {{ t('common.account') }}:
            {{ userStore.user?.canAuthenticateLocally ? t('account.local') : t('account.federation') }}
        </p>
        <div class="name">
            <p>{{ t('common.firstName') }}: {{ userStore.user?.firstName }}</p>
            <p>{{ t('common.lastName') }}: {{ userStore.user?.lastName }}</p>
            <AtomicButton
                v-if="userStore.user?.canAuthenticateLocally"
                icon="mdi-pencil"
                @click="nameDialog = true"
            />
            <QDialog v-model="nameDialog">
                <QCard>
                    <QForm @submit.prevent="onNameSubmit">
                        <QCardSection>
                            <AtomicInput
                                v-model="form.firstName"
                                :label="t('common.firstName')"
                                required
                                :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
                            />
                            <AtomicInput
                                v-model="form.lastName"
                                :label="t('common.lastName')"
                                required
                                :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
                            />
                        </QCardSection>
                        <QCardActions align="right">
                            <AtomicButton
                                :label="t('common.cancel')"
                                no-border
                                @click="onCancel"
                            />
                            <AtomicButton
                                color="primary"
                                :label="t('common.save')"
                                no-border
                                type="submit"
                            />
                        </QCardActions>
                    </QForm>
                </QCard>
            </QDialog>
        </div>
        <div class="email">
            <p>{{ t('common.email') }}: {{ userStore.user?.email }}</p>
            <AtomicButton
                v-if="userStore.user?.canAuthenticateLocally"
                icon="mdi-pencil"
                @click="emailDialog = true"
            />
            <QDialog v-model="emailDialog">
                <QCard>
                    <QForm @submit.prevent="onEmailSubmit">
                        <QCardSection>
                            <AtomicInput
                                v-model="form.email"
                                :label="t('common.email')"
                                required
                                :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
                            />
                        </QCardSection>
                        <QCardActions align="right">
                            <AtomicButton
                                :label="t('common.cancel')"
                                no-border
                                @click="onCancel"
                            />
                            <AtomicButton
                                color="primary"
                                :label="t('common.save')"
                                no-border
                                type="submit"
                            />
                        </QCardActions>
                    </QForm>
                </QCard>
            </QDialog>
        </div>
        <p>{{ t('account.tenantRole') }}: {{ tenantRole }}</p>
    </div>
</template>

<style scoped lang="sass"></style>
