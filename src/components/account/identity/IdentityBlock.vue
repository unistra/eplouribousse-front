<script setup lang="ts">
import AtomicEditableField from '@/components/atomic/AtomicEditableField.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import { ref, watch, computed } from 'vue'
import { QField } from 'quasar'

const { t } = useI18n()
const userStore = useUserStore()

const tenantRole = computed(() => {
    return userStore.user?.isProjectCreator ? t('roles.projectCreator') : ''
})

const firstName = ref(userStore.user?.firstName ?? '')
const lastName = ref(userStore.user?.lastName ?? '')
const email = ref(userStore.user?.email ?? '')

watch(
    () => userStore.user,
    (user) => {
        firstName.value = user?.firstName ?? ''
        lastName.value = user?.lastName ?? ''
        email.value = user?.email ?? ''
    },
    { immediate: true },
)

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
        <q-field
            :label="t('common.account')"
            stack-label
            standard
        >
            <template v-slot:control>
                <div class="display-value">
                    <div class="value-text">
                        {{ userStore.user?.canAuthenticateLocally ? t('account.local') : t('account.federation') }}
                    </div>
                </div>
            </template>
        </q-field>

        <AtomicEditableField
            v-model:modelValue="firstName"
            class="mt-sm"
            :editable="userStore.user?.canAuthenticateLocally"
            :label="t('common.firstName')"
            @save="saveFirstName"
        />

        <AtomicEditableField
            v-model:modelValue="lastName"
            class="mt-sm"
            :editable="userStore.user?.canAuthenticateLocally"
            :label="t('common.lastName')"
            @save="saveLastName"
        />

        <q-field
            class="mt-sm"
            :label="t('common.email')"
            stack-label
            standard
        >
            <template v-slot:control>
                <div class="display-value">
                    <div class="value-text">{{ email }}</div>
                </div>
            </template>
        </q-field>

        <q-field
            class="mt-sm"
            :label="t('account.tenantRole')"
            stack-label
            standard
        >
            <template v-slot:control>
                <div class="display-value">
                    <div class="value-text">{{ tenantRole }}</div>
                </div>
            </template>
        </q-field>
    </div>
</template>

<style scoped>
.block-identity {
    max-width: 300px;
    width: 100%;
}
.display-value {
    min-height: 40px;
    display: flex;
    align-items: center;
    padding: 6px 10px;
    box-sizing: border-box;
}
.value-text {
    flex: 1;
}
.mt-sm {
    margin-top: 8px;
}
</style>
