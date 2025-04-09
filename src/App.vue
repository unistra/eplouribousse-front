<script lang="ts" setup>
import { RouterView } from 'vue-router'
import LayoutFooter from './components/layout/LayoutFooter.vue'
import LayoutHeader from './components/layout/LayoutHeader.vue'
</script>

<template>
    <QLayout view="hhh lpR fff">
        <LayoutHeader />
        <QPageContainer>
            <QPage padding>
                <main class="container">
                    <RouterView />
                </main>
            </QPage>
        </QPageContainer>
        <LayoutFooter />
    </QLayout>
</template>
