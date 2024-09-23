import mongoose, { mongo, Types } from "mongoose";
import { IBaseModel } from "./base";

export interface IUserModel extends IBaseModel {
    externalId: number
    nickname: string
    language: string
    
    profile: null | {
        uid: number
        about: string
        nickname: string
        server: string
        usesVoice: boolean
        languages: string[]
        worldLevel: number
        team: {
            characterId: Types.ObjectId
            level: number
            rank: number
        }[]
    }
}

export type IUserDTO = mongo.WithId<IUserModel>

export const UserModel = {
    getCollection: () => mongoose.connection.collection<IUserModel>('users')
}