import { ID } from './types'
import { IUserDTO } from '@/models/user'

export interface IUserCreate {
    externalId: number
    nickname: string
    language: string
}

export interface IUserRepository {
    get(id: ID): Promise<IUserDTO | null>
    getByExternalId(id: number): Promise<IUserDTO | null>
    search(options: { exceptFor: ID }): Promise<IUserDTO[]>
    create(payload: IUserCreate): Promise<IUserDTO>
    delete(id: ID): Promise<void>
    deleteByExternalId(id: number): Promise<void>
}
