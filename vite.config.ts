import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    return {
        plugins: [
            vue({
                template: { transformAssetUrls },
            }),
            vueDevTools({
                launchEditor: process.env.VITE_EDITOR ?? 'code',
            }),
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
                '&': fileURLToPath(new URL('./constants', import.meta.url)),
            },
        },
        build: {
            sourcemap: true,
        },
    }
})
