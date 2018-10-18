import * as mongoose from 'mongoose'
import axios, { AxiosResponse } from 'axios'
import { IShow, ICastItemResponse } from '../common/interfaces'
import {
  TVMAZE_SHOWS_BASE_URL,
  PAGE_QUERY, CAST,
  STATUS_NOT_FOUND,
  STATUS_TOO_MANY_REQUESTS
} from '../common/constants'

class App {
  public mongoUrl: string
  public showController
  public minDelay: number
  public delayAfterError
  public delayForUpdate: number
  public lastShowId: number
  public baseUrl: string = TVMAZE_SHOWS_BASE_URL
  public pageQuery: string = PAGE_QUERY
  public pageNumber: number = 0
  public castUrl: string = CAST

  constructor({ showController, minDelay, delayAfterError, delayForUpdate, databaseURL }) {
    this.showController = showController
    this.delayAfterError = delayAfterError
    this.delayForUpdate = delayForUpdate
    this.mongoUrl = databaseURL
    this.minDelay = minDelay
    this.mongoSetup()
    this.start()
  }

  private handleShowResponse = (response: AxiosResponse<IShow[]>) => {
    response.data.forEach((el, i) => {
      setTimeout(() => {
        if (this.lastShowId !== 0 && el.id <= this.lastShowId) {
          if (this.lastShowId === el.id) {
             this.lastShowId = 0
          }

          this.getShowIfLastItem(response.data.length, i)

          return
        }

        this.getShowIfLastItem(response.data.length, i)
        this.getCast(el)
      }, this.minDelay * i)
    })
  }

  private getShowIfLastItem(quantity, index) {
    if (quantity - 1 === index) {
      this.getShow()
    }
  }

  private handleCastResponse = (response: AxiosResponse<ICastItemResponse[]>, show: IShow) => {
    const cast = []

    response.data.forEach(({ person }) => {
      cast.push(person)
    })

    this.showController.addNewShow({ ...show, cast })
  }

  private start(): void {
    this.showController.getLastLoadedShow()
      .then(id => {
         this.pageNumber = (Math.floor(id / 250))
         this.lastShowId = id
         this.getShow()
      })
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise
    mongoose.connect(this.mongoUrl, error => {
      error && process.exit(1)
    })
  }

  private getShow(): void {
    axios
      .get<IShow[]>(this.baseUrl + this.pageQuery + this.pageNumber)
      .then(res => {
        this.handleShowResponse(res)
        this.pageNumber++
      }, rej => {
        const { status } = rej

        if (status === STATUS_TOO_MANY_REQUESTS) {
          setTimeout(() => this.getShow(), this.delayAfterError)

          return
        }
        if (status === STATUS_NOT_FOUND) {
          this.pageNumber--
          setTimeout(() => this.getShow(), this.delayForUpdate)

          return
        }
      })
      .catch(console.error)
  }

  private getCast(show: IShow): void {
    axios
      .get<ICastItemResponse[]>(this.baseUrl + '/' + show.id + this.castUrl)
      .then(res => this.handleCastResponse(res, show), rej => {
        const { status } = rej

        if ( status === STATUS_TOO_MANY_REQUESTS ) {
          setTimeout(() => this.getCast(show), this.delayAfterError)
        }
      })
      .catch(console.error)
  }
}

export default App
