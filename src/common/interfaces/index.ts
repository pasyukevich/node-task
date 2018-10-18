export interface IShow {
    id: Number,
    name: String,
    cast: ICastItem[]
}

export interface ICastItem {
     id: Number,
     name: String,
     birthday: String
}

export interface ICastItemResponse {
    person: {
        id: Number,
        name: String,
        birthday: String
    }
}
