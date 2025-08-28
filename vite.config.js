/**
 * @file vite.config.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';
// import basicSsl from '@vitejs/plugin-basic-ssl'; // Only development

const root   = resolve(__dirname, '.');
const publicDir  = resolve(__dirname, 'public');

export default defineConfig({
    // plugins: [
    //     // basicSsl()
    // ],
    root,
    base: './',
    envDir: '../',
    publicDir,
    server: {
        host: '0.0.0.0',
        port: 5174,
    },
    resolve: {
        alias: {
            '@examples' : resolve(root, '/examples'),
            '@dist' : resolve(root, '/dist'),
            '@styles' : resolve(root, '/styles'),
            '@' : resolve(root, '.'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
    },
    esbuild: {
        minify: true,
        drop: ['console', 'debugger'],
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
        minify: true,
        lib: {
            // minifyES: true,
            entry: {
                core: resolve(root, "index.js"),
                component: resolve(root, "component", "index.js"),
            },
            name: "frcl",
            formats: ["es", "cjs"],
            fileName: (format) => `[name].${format}.js`,
        },
        rollupOptions: {
            output: {
                chunkFileNames: 'chunks/[name].[format].js',
                assetFileNames: 'assets/[name][extname]',
           }
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['./**/tests/*.test.js']
    },
})
