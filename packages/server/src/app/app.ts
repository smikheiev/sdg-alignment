import express, { Application } from 'express'
import cors from 'cors'
import { AppConfig } from './config'
import router from './router'

type App = {
  configure: (config: AppConfig) => App
  createHttpServer: () => App
  startHttpServer: () => App
  config?: AppConfig
  server?: Application
}

export default function app(): App {
  return {
    configure(config: AppConfig) {
      this.config = config

      return this
    },

    createHttpServer: function () {
      this.server = express()
      this.server.use(cors())
      this.server.use(express.json())
      this.server.use(router)

      return this
    },

    startHttpServer: function () {
      if (!this.config || !this.server) {
        throw Error('Unable to start http server due to misconfiguration')
      }

      const { port } = this.config

      this.server.listen(port, () =>
        console.log(`-- Server running at localhost:${port} --`),
      )

      return this
    },
  }
}
