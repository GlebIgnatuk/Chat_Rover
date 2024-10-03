import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'

export interface IProfileModel extends IBaseModel {
    userId: Types.ObjectId

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

export type IProfileDTO = mongo.WithId<IProfileModel>

export const ProfileModel = {
    getCollection: () => mongoose.connection.collection<IProfileModel>('profiles'),
}
