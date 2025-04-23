<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <div class="row">
        <div class="col-3">
            {{ t('test') }}
            <QBtn
                :label="t('homePage')"
                outline
                @click="console.log('test')"
            />
        </div>
    </div>
</template>
