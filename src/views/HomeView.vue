<script lang="ts" setup>
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useI18n } from 'vue-i18n'

const globalStore = useGlobalStore()
const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <hgroup>
            <h1>
                {{ t('home.title') }}
                <template v-if="globalStore.tenant?.name">
                    -
                    <span class="tenant">{{ globalStore.tenant?.name }}</span>
                </template>
            </h1>
            <p>{{ t('home.description') }}</p>
        </hgroup>
        <div class="img">
            <a
                href="https://abes.fr"
                rel="noopener"
                target="_blank"
            >
                <QImg
                    :alt="t('home.abesAlt')"
                    fit="contain"
                    src="/img/logo-abes.svg"
                />
            </a>
            <a
                href="https://www.unistra.fr"
                rel="noopener"
                target="_blank"
            >
                <QImg
                    :alt="t('home.unistraAlt')"
                    fit="contain"
                    src="/img/logo-unistra.svg"
                />
            </a>
        </div>
    </QPage>
</template>

<style scoped lang="sass">
hgroup
    display: flex
    flex-direction: column
    gap: 1rem
    align-items: center

    h1
        .tenant
            font-weight: bold

    p
        font-size: var(--font-size-xl)

.img
    display: flex
    justify-content: center
    align-items: center
    gap: 1rem

    a
        display: inline-flex
        justify-content: center
        align-items: center
        width: 24rem
</style>
