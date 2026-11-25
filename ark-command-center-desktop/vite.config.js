import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],build:{target:['es2018','safari13','chrome87','firefox78','edge88']},server:{host:'127.0.0.1',port:1420,strictPort:true}});
