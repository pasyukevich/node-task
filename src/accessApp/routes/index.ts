import { Request, Response } from 'express'
import { ShowController } from '../../common/controllers'
import { STATUS_NOT_FOUND, STATUS_OK, SRATUS_INTERTNAL_ERROR, STATUS_BAD_REQUEST } from '../../common/constants'
import isQueryValid from '../helpers/isQueryValid'

export class Routes {
  public showController: ShowController = new ShowController()

  public routes(app): void {
    app
      .route('/shows')
      .get((req: Request, res: Response) => {
        const { query: { page, limit } } = req
        const pageValidity = isQueryValid(page)
        const limitValidity = isQueryValid(limit)

        if (!pageValidity || !limitValidity) {
          res.status(STATUS_BAD_REQUEST).json(STATUS_BAD_REQUEST)

          return
        }

        this.showController.getShows(Number(page) || 1, Number(limit) || 10)
          .then(array => {
            if (array.length === 0) {
              res.status(STATUS_NOT_FOUND).json(STATUS_NOT_FOUND)

              return
            }

            res.status(STATUS_OK).json(array)
          }, rej => {
            res.status(SRATUS_INTERTNAL_ERROR).json(rej)
          })
          .catch(console.error)
      })
  }
}
