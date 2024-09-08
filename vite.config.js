import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // mode에 따라 .env 파일에서 환경 변수를 로드합니다.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      global: {},  // 브라우저 환경에서 global을 빈 객체로 정의
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_SERVER_IP,
          changeOrigin: true,
        },
      },
    },
  };
});
