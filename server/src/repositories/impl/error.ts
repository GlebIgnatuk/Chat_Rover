import { IErrorCreate, IErrorRepository } from '../error'
import { ErrorModel } from '@/models/error'

export class ErrorRepository implements IErrorRepository {
    async create(payload: IErrorCreate) {
        const now = new Date()

        await ErrorModel.getCollection().insertOne({
            name: payload.name,
            message: payload.message,
            stack: payload.stack,
            location: payload.location,
            externalUserId: payload.externalUserId,
            createdAt: now,
            updatedAt: now,
        })
    }
}
