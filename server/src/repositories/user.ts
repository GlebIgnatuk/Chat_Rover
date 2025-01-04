import { ClientSession } from 'mongoose'
import { ID } from './types'
import { IUserDTO, IUserState } from '@/models/user'

export interface IUserCreate {
    externalId: number
    nickname: string
    language: string
}

export interface IUserPatch {
    state?: IUserState
    isPremium?: boolean
    language?: string
}

export interface IUserRepository {
    get(id: ID): Promise<IUserDTO | null>
    getByExternalId(id: number): Promise<IUserDTO | null>
    search(options: { exceptFor: ID }): Promise<IUserDTO[]>
    create(payload: IUserCreate): Promise<IUserDTO>
    patch(id: ID, payload: IUserPatch, tx?: ClientSession): Promise<IUserDTO | null>
    delete(id: ID): Promise<void>
    deleteByExternalId(id: number): Promise<void>
    trackActivity(id: ID): Promise<void>
}
