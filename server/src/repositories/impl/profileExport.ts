import { Types } from 'mongoose'
import { IProfileExportCreate, IProfileExportRepository } from '../profileExport'
import { ProfileExportModel } from '@/models/profileExport'

export class ProfileExportRepository implements IProfileExportRepository {
    async create(payload: IProfileExportCreate): Promise<void> {
        await ProfileExportModel.getCollection().insertOne({
            profileId: new Types.ObjectId(payload.profileId),
            userId: new Types.ObjectId(payload.userId),
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
}
