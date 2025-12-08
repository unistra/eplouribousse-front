<script setup lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { removeJWTFromLocalStorage } from '@/utils/jwt.ts'
import { useRouter } from 'vue-router'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const router = useRouter()
const { notify } = useComposableQuasar()
const { t } = useI18n()

userStore.clear()
removeJWTFromLocalStorage()
notify({
    message: t('logout.success'),
})

await router.push({ name: 'login' })
</script>
