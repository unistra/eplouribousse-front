<script lang="ts" setup>
import BaseButton from '@/components/base/BaseButton.vue'
import { onMounted, ref } from 'vue'

/**
 * Dans l'idée on aurait juste un objet tenantConf, là on a pas encore
 * de store ou de back fonctionnel donc je les ai codés en dur
 */
const tenantConf1 = {
    color: 'bg-blue-8',
}

const tenantConf2 = {
    color: 'bg-purple-7',
}

/**
 * Là pareil, dans l'idée ce serait un truc du genre ref<ConfigObject>(...)
 */
const globalConf = ref<string>('bg-primary')

onMounted(() => {
    const tenantName = window.location.href
    if (tenantName.includes('tenant1')) {
        globalConf.value = tenantConf1.color
    } else if (tenantName.includes('tenant2')) {
        globalConf.value = tenantConf2.color
    } else {
        globalConf.value = 'bg-primary'
    }
})
</script>

<template>
    <QHeader
        elevated
        :class="globalConf + ' text-white'"
    >
        <QToolbar>
            <QToolbarTitle>Eplouriboussee</QToolbarTitle>
            <!-- <QSpace /> -->
            <BaseButton
                icon="mdi-cog-outline"
                flat
                round
                dense
            >
                <QMenu
                    ><QList style="min-width: 100px">
                        <QItem
                            clickable
                            v-close-popup
                        >
                            <QItemSection>TAB</QItemSection>
                        </QItem>
                    </QList></QMenu
                >
            </BaseButton>
        </QToolbar>
    </QHeader>
</template>
