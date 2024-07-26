import { connection, Types } from 'mongoose'
import { IBaseModel } from './base'

export interface IUser extends IBaseModel {
    userId: number
    displayName: string
}

export interface IUserCreate {
    userId: number
    displayName: string
}

export interface IUserPatch {}

const collection = connection.collection<IUser>('users')

export class UserModel {
    public static get(id: string | Types.ObjectId) {
        return collection.findOne({ _id: new Types.ObjectId(id) })
    }

    public static getByUserId(userId: number) {
        return collection.findOne({ userId })
    }

    public static deleteByUserId(userId: number) {
        return collection.deleteOne({ userId })
    }

    public static async create(input: IUserCreate) {
        const now = new Date()
        const result = await collection.insertOne({
            userId: input.userId,
            displayName: input.displayName,
            createdAt: now,
            updatedAt: now,
        })
        return this.get(result.insertedId)
    }

    public static patch(id: string | Types.ObjectId, input: IUserPatch) {
        const now = new Date()
        return collection.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: { ...input, updatedAt: now } })
    }
}
