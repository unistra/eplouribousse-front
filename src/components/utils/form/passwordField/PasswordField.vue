<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LinearProgress from '@/components/utils/linearProgress/LinearProgress.vue'
import { watch } from 'vue'
import { QSlideTransition, type ValidationRule } from 'quasar'
import { usePasswordValidators } from '@/composables/usePasswordValidators.ts'
import { usePasswordField } from '@/components/utils/form/passwordField/usePasswordField.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const { getPasswordStrength } = usePasswordValidators()

const props = defineProps<{
    modelValue: string
    label?: string
    linearProgress?: boolean
    required?: boolean
    autofocus?: boolean
    rules?: ValidationRule[]
}>()
const { isInputFocused, passwordStrength, isPasswordVisible, defaultLabel, icon } = usePasswordField()

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
</script>

<template>
    <div
        ref="wrapperEl"
        class="wrapper"
    >
        <QInput
            :autofocus="autofocus"
            :hide-bottom-space="true"
            :label="label ?? defaultLabel"
            :model-value="modelValue"
            outlined
            :required="required"
            rounded
            :rules="rules"
            :type="isPasswordVisible ? 'text' : 'password'"
            @blur="() => (isInputFocused = false)"
            @focus="() => (isInputFocused = true)"
            @update:model-value="(val) => emit('update:modelValue', val as string)"
        >
            <template #append>
                <AtomicButton
                    dense
                    flat
                    :icon="icon"
                    rounded
                    @click="() => (isPasswordVisible = !isPasswordVisible)"
                >
                    <QTooltip>
                        {{ t(`forms.password.isVisibleTooltip.${isPasswordVisible.toString()}`) }}
                    </QTooltip>
                </AtomicButton>
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
