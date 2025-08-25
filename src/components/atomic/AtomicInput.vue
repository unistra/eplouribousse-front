<script lang="ts" setup>
import AtomicIcon from './AtomicIcon.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { computed, onMounted, useTemplateRef } from 'vue'
import { type QInput } from 'quasar'

const model = defineModel<string | number | undefined>()

const props = defineProps<{
    autofocus?: boolean
    hideBottomSpace?: boolean
    type?: 'text' | 'textarea' | 'email' | 'search' | 'number' | 'url' | 'password' | 'date' | 'datetime-local'
    label?: string
    clearable?: boolean
    counter?: boolean
    disable?: boolean
    required?: boolean
    icon?: string
    tooltip?: string
    dataTestid?: string
    quickInput?: boolean
}>()

const emit = defineEmits<{
    (e: 'clear'): void
    (e: 'done'): void
    (e: 'cancel'): void
}>()
const input = useTemplateRef<QInput>('input')

const computedLabel = computed(() => (props.label ? `${props.label}${props.required ? ' *' : ''}` : undefined))
onMounted(() => {
    if (props.quickInput && input.value) {
        input.value.focus()
    }
})
</script>

<template>
    <QInput
        ref="input"
        v-model="model"
        :autofocus
        :clearable
        color="grey-100"
        :data-testid
        :disable
        :hide-bottom-space
        :label="computedLabel"
        outlined
        rounded
        :type="type ?? 'text'"
        @clear="emit('clear')"
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
        <template
            v-if="icon"
            #prepend
        >
            <AtomicIcon :name="icon" />
        </template>
        <template
            v-if="!icon && quickInput"
            #append
        >
            <AtomicButton
                color="positive"
                icon="mdi-check"
                @click="emit('done')"
            />
            <AtomicButton
                icon="mdi-close"
                @click="emit('cancel')"
            />
        </template>
    </QInput>
</template>
