import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import contactHandler from './api/contact.js'

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url === '/api/contact' || req.url.startsWith('/api/contact?'))) {
          const buffers = []
          for await (const chunk of req) {
            buffers.push(chunk)
          }
          const rawBody = Buffer.concat(buffers).toString('utf-8')
          let body = {}
          try {
            body = rawBody ? JSON.parse(rawBody) : {}
          } catch {
            body = {}
          }

          const vercelRes = {
            statusCode: 200,
            setHeader(key, val) {
              res.setHeader(key, val)
              return this
            },
            status(code) {
              this.statusCode = code
              res.statusCode = code
              return this
            },
            json(data) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = this.statusCode
              res.end(JSON.stringify(data))
              return this
            },
            end(data) {
              res.statusCode = this.statusCode
              res.end(data)
              return this
            },
          }

          const vercelReq = {
            method: req.method,
            headers: req.headers,
            body,
            socket: req.socket,
          }

          try {
            await contactHandler(vercelReq, vercelRes)
          } catch (err) {
            console.error('Vite dev server API error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Internal serverless middleware error' }))
          }
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'r3f': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
