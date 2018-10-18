import * as mongoose from 'mongoose'
import { Show } from '../models'
import { IShow } from '../interfaces'

export class ShowController {
  public addNewShow(req: IShow) {
    const newShow = new Show(req)

    newShow.save((err, el) => {
      if (err) {
        console.error(err)

        return
      }

      this.findAndSortCast(el)
    })
  }

  public findAndSortCast({ id }) {
    Show.findOneAndUpdate(
      { id },
      {
        $push: {
          cast: {
            $each: [],
            $sort: {
              birthday: -1
            }
          }
        }
      },
      err => err && console.error(err)
    )
  }

  public getShows(page: Number, limit: Number) {
    const toSkip = (Number(page) - 1) * Number(limit)

    return Show.find({})
      .skip(toSkip)
      .limit(limit)
      .exec()
      .then(results => Promise.resolve(results), err => Promise.reject(err))
  }

  public getLastLoadedShow() {
    return Show.findOne().sort({ field: 'asc', _id: -1 }).exec().then(show => {
      if (!show) {
        return 0
      }

      return show.id
    })
  }
}
