import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'
import { ILanguageKey, IServerKey } from '@/config/config'

export interface ITeamMember {
    characterId: Types.ObjectId
    level: number
    constellation: number
}

export interface IProfileModel extends IBaseModel {
    userId: Types.ObjectId
    uid: number
    about: string
    nickname: string
    server: IServerKey
    usesVoice: boolean
    languages: ILanguageKey[]
    worldLevel: number
    team: [ITeamMember | null, ITeamMember | null, ITeamMember | null]
}

export type IProfileDTO = mongo.WithId<IProfileModel>

export const ProfileModel = {
    getCollection: () => mongoose.connection.collection<IProfileModel>('profiles'),
}
