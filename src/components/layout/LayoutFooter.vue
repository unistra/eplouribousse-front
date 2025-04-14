<script lang="ts" setup>
import type { Link } from '#/utils'

const links: Link[] = []
</script>

<template>
    <QFooter
        class="bg-grey-8 text-white container-center footer"
        elevated
    >
        Footer en construction
        <a
            v-for="(link, index) in links"
            :key="index"
            :href="link.value"
            >{{ link.label }}
        </a>
    </QFooter>
</template>

<style>
.footer {
    padding-bottom: 1dvh;
    padding-top: 1dvh;
}
</style>
