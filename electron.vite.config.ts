import {defineConfig, externalizeDepsPlugin} from 'electron-vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {createHtmlPlugin} from "vite-plugin-html";

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            minify: 'terser',
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            minify: 'terser'
        }
    },
    renderer: {
        plugins: [svelte()],
        build: {
            minify: 'terser',
            rollupOptions: {
                plugins: [
                    createHtmlPlugin({
                        minify: true
                    })
                ]
            }
        }
    }
})
