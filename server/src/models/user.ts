import mongoose, { mongo, Types } from "mongoose";
import { IBaseModel } from "./base";

export interface IUserModel extends IBaseModel {
    externalId: number
    nickname: string
    language: string
    lastActivityAt: Date
}

export type IUserDTO = mongo.WithId<IUserModel>

export const UserModel = {
    getCollection: () => mongoose.connection.collection<IUserModel>('users')
}