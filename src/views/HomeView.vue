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
                {{ t('views.home.title') }}
                <template v-if="globalStore.tenant?.name">
                    -
                    <span class="tenant">{{ globalStore.tenant?.name }}</span>
                </template>
            </h1>
            <p>{{ t('views.home.description') }}</p>
        </hgroup>
        <div class="imgs">
            <div>
                <a
                    href="https://abes.fr"
                    rel="noopener"
                    target="_blank"
                >
                    <QImg
                        :alt="t('views.home.abesAlt')"
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
                        :alt="t('views.home.unistraAlt')"
                        fit="contain"
                        src="/img/logo-unistra.svg"
                    />
                </a>
            </div>
            <a
                href="https://www.collexpersee.eu/"
                rel="noopener"
                target="_blank"
            >
                <QImg
                    :alt="t('views.home.collexAlt')"
                    fit="contain"
                    src="/img/logo-collex.png"
                />
            </a>
        </div>
    </QPage>
</template>

<style scoped lang="sass">
main
    display: flex
    flex-direction: column

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

    .imgs
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        gap: 2rem
        flex-grow: 1

        a
            display: inline-flex
            justify-content: center
            align-items: center
            width: 24rem

        > :first-child
            display: flex
            align-items: center
            gap: 2rem

        > :last-child
            width: 20rem
</style>
