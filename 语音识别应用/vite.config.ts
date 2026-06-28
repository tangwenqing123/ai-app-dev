import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/asr': {
          target: 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/speech-to-text',
          changeOrigin: true,
          rewrite: (path) => '',
          headers: {
            'Authorization': `Bearer ${env.VITE_DASHSCOPE_API_KEY || ''}`,
          },
        },
      },
    },
  }
})
