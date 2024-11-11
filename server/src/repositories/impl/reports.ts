import { ReportModel, IReportDTO, ReasonType, REASONS } from '@/models/report'
import { ID, PaginationOptions } from '../types'
import { Types } from 'mongoose'
import { IUserRepository } from '../user'

export class ReportRepository {
    private readonly userRepo: IUserRepository

    constructor(userRepo: IUserRepository) {
        this.userRepo = userRepo
    }

    async create(payload: { reporterId: ID; messageId: ID; reason: ReasonType; details: string }): Promise<IReportDTO> {
        const now = new Date()

        // Validate reason
        if (!REASONS.includes(payload.reason)) {
            throw new Error(`Invalid reason provided. Valid reasons are: ${REASONS.join(', ')}`)
        }

        const inserted = await ReportModel.getCollection().insertOne({
            reporterId: new Types.ObjectId(payload.reporterId),
            messageId: new Types.ObjectId(payload.messageId),
            reason: payload.reason,
            details: payload.details,
            createdAt: now,
            updatedAt: now,
        })

        const report = await this.get(inserted.insertedId)
        if (!report) {
            throw new Error('Failed to create report')
        }

        return report
    }

    async get(id: ID): Promise<IReportDTO | null> {
        const reports = await ReportModel.getCollection()
            .aggregate<IReportDTO>([
                { $match: { _id: new Types.ObjectId(id) } },
                { $limit: 1 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'reporterId',
                        foreignField: '_id',
                        as: 'reporter',
                    },
                },
                {
                    $unwind: {
                        path: '$reporter',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ])
            .toArray()

        return reports[0] ?? null
    }

    async list(options?: PaginationOptions): Promise<IReportDTO[]> {
        const page = options?.page ?? 0
        const limit = options?.limit ?? 15

        const reports = await ReportModel.getCollection()
            .aggregate<IReportDTO>([
                { $sort: { createdAt: -1 } },
                { $skip: page * limit },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'reporterId',
                        foreignField: '_id',
                        as: 'reporter',
                    },
                },
                {
                    $unwind: {
                        path: '$reporter',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ])
            .toArray()

        return reports
    }
}
