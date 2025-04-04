import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        vueDevTools(),
        quasar({
            autoImportComponentCase: 'pascal',
            sassVariables: fileURLToPath(new URL('./src/assets/quasar-variables.sass', import.meta.url)),
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '#': fileURLToPath(new URL('./types', import.meta.url)),
            '~': fileURLToPath(new URL('./tests', import.meta.url)),
        },
    },
    build: {
        sourcemap: true,
    },
})
