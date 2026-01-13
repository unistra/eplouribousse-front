<script setup lang="ts">
import AtomicEditableField from '@/components/atomic/AtomicEditableField.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import { ref, computed, onMounted } from 'vue'

const { t, locale } = useI18n()
const userStore = useUserStore()

const tenantRole = computed(() => {
    const roles: string[] = [
        userStore.user?.isSuperuser ? t('fn.roles.superUser') : undefined,
        userStore.user?.isProjectCreator ? t('fn.roles.projectCreator') : undefined,
    ].filter((el) => el !== undefined)

    return roles.length
        ? new Intl.ListFormat(locale.value, {
              style: 'long',
              type: 'conjunction',
          }).format(roles)
        : t('fn.roles.none')
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
        await userStore.patchUser({ firstName: value })
    } catch (err) {
        console.error('Error updating first name:', err)
    }
}

const saveLastName = async (value: string) => {
    if (value === userStore.user?.lastName) return
    try {
        await userStore.patchUser({ lastName: value })
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
                        {{
                            userStore.user?.canAuthenticateLocally
                                ? t('views.account.local')
                                : t('views.account.federation')
                        }}
                    </p>
                </template>
            </QField>

            <QField
                :label="t('common.emailAddress')"
                stack-label
                standard
            >
                <template #control>
                    <p>{{ email }}</p>
                </template>
            </QField>
            <QField
                :label="t('views.account.tenantRole')"
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
