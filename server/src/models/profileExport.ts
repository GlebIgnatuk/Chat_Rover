import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'

export interface IProfileExportModel extends IBaseModel {
    userId: Types.ObjectId
    profileId: Types.ObjectId
}

export type IProfileExportDTO = mongo.WithId<IProfileExportModel>

export const ProfileExportModel = {
    getCollection: () => mongoose.connection.collection<IProfileExportModel>('profile_exports'),
}
