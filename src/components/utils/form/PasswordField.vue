<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LinearProgress from '@/components/utils/linearProgress/LinearProgress.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { QSlideTransition, type ValidationRule } from 'quasar'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import { dictionary } from '@zxcvbn-ts/language-common'
import type { QInput } from 'quasar'

const { t } = useI18n()

const props = defineProps<{
    modelValue: string
    label?: string
    linearProgress?: boolean
    required?: boolean
    autofocus?: boolean
    rules?: ValidationRule[]
}>()

const label = props.label ?? t('forms.login.password')
const isPasswordVisible = ref<boolean>(false)
const icon = computed(() => (isPasswordVisible.value ? 'mdi-eye-off-outline' : 'mdi-eye-outline'))
const passwordVisibilityLabel = computed(() => `forms.password.isVisibleTooltip.${isPasswordVisible.value.toString()}`)
const passwordStrength = ref(0)

const getPasswordStrength = (password: string) => {
    zxcvbnOptions.setOptions({
        dictionary: {
            ...dictionary,
        },
    })
    return zxcvbn(password).score as number
}

const emit = defineEmits<{
    'update:modelValue': [value: string]
    passwordStrengthChange: [strength: number]
}>()

watch(
    () => props.modelValue,
    (newValue) => {
        passwordStrength.value = getPasswordStrength(newValue)
        emit('passwordStrengthChange', passwordStrength.value)
    },
)

const isInputFocused = ref<boolean>(false)
</script>

<template>
    <div
        ref="wrapperEl"
        class="wrapper"
    >
        <QInput
            :model-value="modelValue"
            @update:model-value="(val) => emit('update:modelValue', val as string)"
            :label="label"
            :type="isPasswordVisible ? 'text' : 'password'"
            :required="required"
            :autofocus="autofocus"
            :rules="rules"
            :hide-bottom-space="true"
            @focus="() => (isInputFocused = true)"
            @blur="() => (isInputFocused = false)"
        >
            <template #append>
                <QBtn
                    flat
                    dense
                    rounded
                    data-testid="visibility-button"
                    :icon="icon"
                    @click="() => (isPasswordVisible = !isPasswordVisible)"
                >
                    <QTooltip>
                        {{ t(passwordVisibilityLabel) }}
                    </QTooltip>
                </QBtn>
            </template>
        </QInput>
        <QSlideTransition ref="linearProgressEl">
            <LinearProgress
                v-if="(linearProgress && isInputFocused) || (linearProgress && modelValue.length > 0)"
                :password-strength="passwordStrength"
            />
        </QSlideTransition>
    </div>
</template>

<style scoped lang="scss">
.wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.q-input {
    width: 100%;
}
</style>
