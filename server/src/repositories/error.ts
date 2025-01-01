export interface IErrorCreate {
    name: string
    message: string
    stack?: string
    location: string
    externalUserId?: number
}

export interface IErrorRepository {
    create(payload: IErrorCreate): Promise<void>
}
