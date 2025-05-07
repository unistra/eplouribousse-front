<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <div class="or-block">
        <QSeparator />
        <span>{{ t('forms.login.or') }}</span>
        <QSeparator />
    </div>
</template>

<style scoped lang="scss">
.or-block {
    width: 256px;
    margin: 24px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    gap: 16px;

    hr {
        width: 100%;
    }
}
</style>
