import { ID, PaginationOptions } from './types'
import { IReportDTO } from '@/models/report'

export interface IReportCreate {
    reporterId: ID
    messageId: ID
    reason: string
    details: string
}

export interface IReportRepository {
    get(id: ID): Promise<IReportDTO | null>
    list(options?: PaginationOptions): Promise<IReportDTO[]>
    create(payload: IReportCreate): Promise<IReportDTO>
}
