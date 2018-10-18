import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

const CastItemSchema = new Schema(
  {
    _id: false,
    birthday: String,
    id: Number,
    name: String
  },
  { versionKey: false }
)

const ShowSchema = new Schema(
  {
    cast: [CastItemSchema],
    id: { type: Number, required: true},
    name: { type: String, required: true}
  },
  { versionKey: false }
)

ShowSchema.methods.toJSON = function() {
  const { _id, ...obj } = this.toObject()

  return obj
}

export const Show = mongoose.model('Show', ShowSchema)
