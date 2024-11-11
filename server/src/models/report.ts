import mongoose, { mongo, Types } from 'mongoose'
import { IUserDTO } from './user'
import { IBaseModel } from './base'

export interface IReportModel extends IBaseModel {
    messageId: Types.ObjectId
    reporterId: Types.ObjectId
    reason: string
    details: string
}

export const REASONS = ['reason1', 'reason2'] as const
export type ReasonType = (typeof REASONS)[number]

export type IReportDTO = mongo.WithId<IReportModel> & {
    reporterId: IUserDTO
}

export const ReportModel = {
    getCollection: () => mongoose.connection.collection<IReportModel>('reports'),
}
