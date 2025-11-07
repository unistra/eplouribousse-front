<script setup lang="ts">
import AtomicEditableField from '@/components/atomic/AtomicEditableField.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import { ref, computed, onMounted } from 'vue'

const { t } = useI18n()
const userStore = useUserStore()

const tenantRole = computed(() => {
    return userStore.user?.isProjectCreator ? t('roles.projectCreator') : ''
})

const firstName = ref('')
const lastName = ref('')
const email = ref('')

onMounted(() => {
    firstName.value = userStore.user?.firstName ?? ''
    lastName.value = userStore.user?.lastName ?? ''
    email.value = userStore.user?.email ?? ''
})

const saveFirstName = async (value: string) => {
    if (value === userStore.user?.firstName) return
    try {
        await userStore.updateProfile({ firstName: value })
    } catch (err) {
        console.error('Error updating first name:', err)
    }
}

const saveLastName = async (value: string) => {
    if (value === userStore.user?.lastName) return
    try {
        await userStore.updateProfile({ lastName: value })
    } catch (err) {
        console.error('Error updating last name:', err)
    }
}
</script>

<template>
    <div class="block-identity">
        <div>
            <QField
                :label="t('common.account')"
                stack-label
                standard
            >
                <template #control>
                    <p>
                        {{ userStore.user?.canAuthenticateLocally ? t('account.local') : t('account.federation') }}
                    </p>
                </template>
            </QField>

            <QField
                :label="t('common.email')"
                stack-label
                standard
            >
                <template #control>
                    <p>{{ email }}</p>
                </template>
            </QField>
            <QField
                :label="t('account.tenantRole')"
                stack-label
                standard
            >
                <template #control>
                    <p>{{ tenantRole }}</p>
                </template>
            </QField>
        </div>
        <div>
            <AtomicEditableField
                v-model="firstName"
                :editable="userStore.user?.canAuthenticateLocally"
                :label="t('common.firstName')"
                @save="saveFirstName"
            />

            <AtomicEditableField
                v-model="lastName"
                :editable="userStore.user?.canAuthenticateLocally"
                :label="t('common.lastName')"
                @save="saveLastName"
            />
        </div>
    </div>
</template>

<style scoped lang="sass">
.block-identity
    display: flex
    flex-direction: column
    gap: 1rem
    width: 100%
    div
        display: flex
        gap: 2rem


        .q-field
            width: fit-content
            min-width: 24rem
</style>
