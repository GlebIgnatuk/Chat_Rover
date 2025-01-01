import { ID } from './types'

export interface IProfileExportCreate {
    userId: ID
    profileId: ID
}

export interface IProfileExportRepository {
    create(payload: IProfileExportCreate): Promise<void>
}
