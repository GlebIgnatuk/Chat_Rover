import { ClientSession } from 'mongoose'
import { ID } from './types'
import { IBalancePromocodeDTO } from '@/models/balancePromocode'

export interface IBalancePromocodeCreate {
    value: number
    code: string
    expiresAt: Date | null
}

export interface IBalancePromocodeRepository {
    list(): Promise<IBalancePromocodeDTO[]>
    findByCode(code: string, session?: ClientSession): Promise<IBalancePromocodeDTO | null>
    create(payload: IBalancePromocodeCreate): Promise<IBalancePromocodeDTO>
    expire(id: ID): Promise<IBalancePromocodeDTO | null>
}
