<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    modelValue: string
    label?: string
    editable?: boolean
    type?: 'number' | 'text' | 'textarea'
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'save', value: string): void
    (e: 'cancel'): void
}>()

const { t } = useI18n()
const editing = ref(false)
const localValue = ref(props.modelValue)

watch(
    () => props.modelValue,
    (v) => {
        localValue.value = v
    },
)

const startEdit = () => {
    if (!props.editable) return
    editing.value = true
    // focus handled by q-input autofocus
}

const save = () => {
    emit('update:modelValue', localValue.value)
    emit('save', localValue.value)
    editing.value = false
}

const cancel = () => {
    localValue.value = props.modelValue
    editing.value = false
    emit('cancel')
}
</script>

<template>
    <QField
        :label="props.label"
        stack-label
        standard
    >
        <template #control>
            <QInput
                v-if="editing"
                v-model="localValue"
                autofocus
                dense
                :type="props.type || 'text'"
                @keyup.enter.exact="save"
                @keyup.esc="cancel"
                @keyup.shift.enter="undefined"
            />
            <div
                v-else
                class="display-value"
            >
                {{ props.modelValue || '-' }}
            </div>
        </template>

        <template #append>
            <QBtn
                v-if="props.editable && !editing"
                :aria-label="t('common.edit')"
                dense
                flat
                icon="mdi-pencil"
                round
                @click="startEdit"
            />
            <div
                v-if="editing"
                class="btn"
            >
                <QBtn
                    :aria-label="t('common.save')"
                    color="primary"
                    dense
                    flat
                    icon="mdi-check"
                    @click="save"
                />
                <QBtn
                    :aria-label="t('common.cancel')"
                    dense
                    flat
                    icon="mdi-close"
                    @click="cancel"
                />
            </div>
        </template>
    </QField>
</template>

<style scoped lang="sass">
.display-value
    padding: 0.5rem
    white-space: pre-wrap

.btn
    display: flex
    gap: 0.5rem
</style>
