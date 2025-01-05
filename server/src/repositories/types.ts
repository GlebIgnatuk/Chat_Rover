import { Types } from 'mongoose'

export type ID = string | Types.ObjectId

export interface PaginationOptions {
    limit: number
    page: number
}

export class RepositoryError extends Error {
    code?: string

    constructor(message: string, code?: string) {
        super(message)

        this.code = code
    }
}
