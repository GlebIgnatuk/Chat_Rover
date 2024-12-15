import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import os from 'os'
import { defineConfig, UserConfig } from 'vite'

const env = process.env.NODE_ENV || 'development'
const dev = env !== 'production'
const ssl = process.env.SSL !== 'false'
const mode = ssl ? `${env}.ssl` : env

const interfaces = Object.entries(os.networkInterfaces()).reduce<Record<string, string[]>>(
    (acc, [name, nets]) => {
        const available = (nets?.filter((net) => net.family === 'IPv4' && !net.internal) ?? []).map(
            (net) => net.address,
        )

        if (available.length > 0) acc[name] = available

        return acc
    },
    {},
)

const plugins: UserConfig['plugins'] = [react()]
if (ssl) {
    plugins.push(basicSsl())
}

console.log(`Vite config:`)
console.log(`- SSL:      ${ssl}`)
console.log(`- NODE_ENV: ${env}`)
console.log(`- MODE:     ${mode}`)
console.log()
console.log(`Available interfaces:`)
for (const net in interfaces) {
    console.log(`- ${net}`)
    for (const address of interfaces[net]) {
        console.log(`\t- ${address}`)
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: plugins,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: dev ? '' : '../server/dist/public',
    },
    mode: mode,
    base: dev ? '/' : '/public',
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target:
                    'en0' in interfaces
                        ? `http://${interfaces['en0'][0]}:4000`
                        : 'http://127.0.0.1:4000',
                changeOrigin: true,
                secure: false,
            },
            '/socket.io': {
                target:
                    'en0' in interfaces
                        ? `ws://${interfaces['en0'][0]}:4000`
                        : 'ws://127.0.0.1:4000',
                ws: true,
                rewriteWsOrigin: true,
                secure: false,
            },
        },
    },
})
