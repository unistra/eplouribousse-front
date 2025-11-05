<script setup lang="ts">
import { ref, watch } from 'vue'
import { QField, QInput, QBtn } from 'quasar'

const props = defineProps<{
    modelValue: string
    label?: string
    editable?: boolean
    type?: 'number' | 'text'
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'save', value: string): void
    (e: 'cancel'): void
}>()

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
    <q-field
        :label="props.label"
        stack-label
        standard
    >
        <template #control>
            <q-input
                v-if="editing"
                v-model="localValue"
                autofocus
                dense
                :type="props.type || 'text'"
                @keyup.enter="save"
                @keyup.esc="cancel"
            />
            <div
                v-else
                class="display-value"
            >
                {{ props.modelValue || '-' }}
            </div>
        </template>

        <template #append>
            <q-btn
                v-if="props.editable"
                aria-label="Edit"
                dense
                flat
                icon="mdi-pencil"
                round
                @click="startEdit"
            />
            <div
                v-if="editing"
                class="row items-center q-gutter-sm"
            >
                <q-btn
                    aria-label="Save"
                    color="primary"
                    dense
                    flat
                    icon="mdi-check"
                    @click="save"
                />
                <q-btn
                    aria-label="Cancel"
                    dense
                    flat
                    icon="mdi-close"
                    @click="cancel"
                />
            </div>
        </template>
    </q-field>
</template>

<style scoped>
.display-value {
    min-height: 40px;
    display: flex;
    align-items: center;
    padding: 6px 10px;
    box-sizing: border-box;
}
</style>
