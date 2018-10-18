import { ShowController } from '../common/controllers'
import { Routes } from './routes'
import App from './App'
import * as dotenv from 'dotenv'
import * as config from 'config'

dotenv.config()

const showController = new ShowController()
const routes = new Routes()
const PORT = config.get('serverConfig.port')
const databaseURL = config.get('dbConfig.url')

const acessApp = new App({ showController, databaseURL, routes })

acessApp.app.listen(PORT, err => {
  if (err) {
    throw err
  }

  console.log('Express server listening on port ' + PORT)
})

process
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception Thrown')
  })
