import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
<<<<<<< HEAD
      '/api': {
        target: 'http://127.0.0.1:8000', // 👈 change this
        changeOrigin: true,
        secure: false
      }
    }
  }
})
=======
      '/api': 'http://localhost:8000'
    }
  }
})
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
