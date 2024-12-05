import config from './app/config'
import app from './app/app'

function startApp() {
  app().configure(config).createHttpServer().startHttpServer()
}

startApp()
