<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import axiosI from '@/plugins/axios.ts'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const token = useRoute().query.t
const router = useRouter()
const { t } = useI18n()
const globalStore = useGlobalStore()

onMounted(async () => {
    try {
        const response = await axiosI.post<{ access: string; refresh: string }>('/user/login-handshakee/', {
            t: token,
        })

        localStorage.setItem('JWT__access__token', response.data.access)
        localStorage.setItem('JWT__refresh__token', response.data.refresh)

        await router.push({
            name: 'Home',
        })
    } catch (e) {
        globalStore.addNotify({
            type: 'negative',
            message: t('errors.unknown') + ', ' + t('errors.retry'),
            timeout: 8000,
        })
        await router.push({ name: 'Home' })
    }
})
</script>
