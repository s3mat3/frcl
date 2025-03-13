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

const root   = resolve(__dirname, 'lib');
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
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        minify: 'esbuild',
        terserOptions: {
            module: true,
            toplevel: true,
            compress: {
                passes: 1,
            },
        },
        lib: {
            // minifyES: true,
            entry: 'index.js',
            name: 'frcl',
            formats: ["es", "umd"],
            fileName: (format) => `frcl.${format}.js`,
        },
        // rollupOptions: {
        //     input: {
        //         sndb: resolve("/examples", '/sndb/', 'index.html'),
        //     },
        //     // output: {
        //     //     entryFileNames: `assets/[name]/entrypoint.js`,
        //     //     chunkFileNames: `assets/[name]/chank.js`,
        //     //     assetFileNames: `assets/[name]/asset.[ext]`,
        //     // },
        // },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['./**/tests/*.test.js']
    },
})
