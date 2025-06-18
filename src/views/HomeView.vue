<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
const _lines = ref<number>(2)
const _rows = ref<number>(3)
const _cols = ref<number>(2)
const sizes = ['', 'very-small', 'small', 'medium', 'base', 'large', 'very-large']
const cont = [0, 10, 10, 50, 100, 100, 200]
</script>

<template>
    <div class="row">
        <div class="col-3">
            <QBtn
                :label="t('homePage')"
                outline
                @click="console.log('test')"
                ><AtomicIcon
                    color="color-red"
                    name="mdi-close"
                    tooltip="test"
            /></QBtn>
            <br />
            <br />
            <AtomicButton
                color="red"
                icon="mdi-close"
                label="youpi"
            />
            <AtomicButton
                icon="mdi-close"
                label="youpi"
            />
            <br /><br />
        </div>
    </div>

    <div
        class="container column"
        style="background-color: red"
    >
        <div
            v-for="i in 6"
            :key="i"
            :class="`container-item ${sizes[i]} center`"
            style="background-color: yellow; flex-grow: 1; align-content: stretch"
        >
            <p
                v-for="j in cont[i]"
                :key="j"
                style="background-color: black; color: white"
            >
                Ceci est une longue chaine de caractère et c'est fait exprès
            </p>
            <QSpace />
        </div>
    </div>

    <!-- <div
        class="container row"
        style="background-color: red"
    >
        <div
            v-for="i in rows"
            class="container-item very-large"
            style="background-color: green"
        >
            <p
                v-for="i in lines"
                style="color: white; background-color: black"
            >
                Ceci est une longue chaine de caractère et c'est fait exprès
            </p>
        </div>
        <div
            class="container column"
            style="background-color: blueviolet"
        >
            <div
                class="container-item very-small"
                style="background-color: green"
                v-for="i in cols"
            >
                <p
                    v-for="i in lines"
                    style="color: white; background-color: black"
                >
                    Ceci est une longue chaine de caractère et c'est fait exprès
                </p>
            </div>
        </div>
    </div> -->

    <!-- <div
        class="container column"
        style="background-color: red"
    >
        <div
            v-for="i in rows"
            class="container-item very-small"
            style="background-color: yellow"
        >
            <p
                v-for="i in lines"
                style="background-color: black; color: white"
            >
                Ceci est une longue chaine de caractère et c'est fait exprès
            </p>
        </div>

        <div
            class="container row"
            style="background-color: blueviolet"
        >
            <div
                class="container-item very-small"
                style="background-color: yellow"
                v-for="i in cols"
            >
                <p
                    v-for="i in lines"
                    style="background-color: black; color: white"
                >
                    Ceci est une longue chaine de caractère et c'est fait exprès
                </p>
            </div>
        </div>
    </div> -->
</template>
