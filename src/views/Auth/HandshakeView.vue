<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import axiosI from '@/plugins/axios.ts'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const token = useRoute().query.t
const router = useRouter()
const { t } = useI18n()
const globalStore = useGlobalStore()
const userStore = useUserStore()

onMounted(async () => {
    try {
        const response = await axiosI.post<{ access: string; refresh: string }>('/user/login-handshake/', {
            t: token,
        })

        userStore.isAuth = true
        localStorage.setItem('JWT__access__token', response.data.access)
        localStorage.setItem('JWT__refresh__token', response.data.refresh)

        const profile = await axiosI.get('/user/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('JWT__access__token')}`,
            },
        })
        localStorage.setItem('username', profile.data.username)

        await router.push({
            name: 'Home',
        })
    } catch (e) {
        globalStore.addNotify({
            type: 'negative',
            message: t('errors.unknown') + ', ' + t('errors.retry'),
            timeout: 10000,
        })
        await router.push({ name: 'Home' })
    }
})
</script>
