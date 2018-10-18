import * as express from 'express'
import * as mongoose from 'mongoose'
import * as morgan from 'morgan'
import winston from './logger/winston'

class App {
  public app: express.Application
  public routePrv
  public mongoUrl: string
  public showController
  constructor({ showController, databaseURL, routes }) {
    this.showController = showController
    this.mongoUrl = databaseURL
    this.routePrv = routes
    this.app = express()
    this.config()
    this.routePrv.routes(this.app)
    this.mongoSetup()
  }

  private config(): void {
    this.app.use(morgan('combined', { stream: winston }))
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise
    mongoose.connect(this.mongoUrl, error => error && process.exit(1))
  }
}

export default App
