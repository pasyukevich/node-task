import App from './App'
import { ShowController } from '../common/controllers'
import * as dotenv from 'dotenv'
import * as config from 'config'

dotenv.config()

const showController = new ShowController()
const minDelay = config.get('timerConfig.minDelay')
const delayAfterError = config.get('timerConfig.delayAfterError')
const delayForUpdate = config.get('timerConfig.delayForUpdate')
const databaseURL = config.get('dbConfig.url')

new App({ showController, minDelay, delayAfterError, delayForUpdate, databaseURL })

process
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception Thrown')
  })
