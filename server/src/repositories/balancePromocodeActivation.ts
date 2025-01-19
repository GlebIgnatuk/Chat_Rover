import { IBalancePromocodeActivationDTO } from '@/models/balancePromocodeActivation'
import { ID } from './types'
import { ClientSession } from 'mongoose'

export interface IBalancePromocodeActivationCreate {
    userId: ID
    balancePromocodeId: ID
}

export interface IBalancePromocodeActivationRepository {
    create(
        payload: IBalancePromocodeActivationCreate,
        tx?: ClientSession,
    ): Promise<IBalancePromocodeActivationDTO>
}
