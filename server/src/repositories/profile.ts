import { Types } from 'mongoose'
import { ID } from './types'
import { IProfileDTO } from '@/models/profile'
import { IPublicUserDTO } from '@/models/user'

export interface IProfileCreate {
    userId: ID
    uid: number
    about: string
    nickname: string
    server: 'SEA' | 'Asia' | 'Europe' | 'HMT' | 'America'
    usesVoice: boolean
    languages: string[]
    worldLevel: number
    team: ({
        characterId: ID
        level: number
        constellation: number
    } | null)[]
}

export interface IProfileUpdate extends Partial<IProfileCreate> {}

export type ISearchedProfileDTO = Omit<IProfileDTO, 'userId'> & {
    user: IPublicUserDTO
}

export interface IProfileSearchParams {
    id?: string
    userId?: string
    uid?: number
    nickname?: string
    server?: string
    usesVoice?: boolean
    languages?: string[]
    minWorldLevel?: number
    maxWorldLevel?: number
    team?: ITeamSearchParams[]
    limit?: number
    page?: number
}

export interface ITeamSearchParams {
    characterId?: Types.ObjectId
    minLevel?: number
    maxLevel?: number
    minConstellation?: number
    maxConstellation?: number
}

export interface IProfileRepository {
    get(id: ID): Promise<IProfileDTO | null>
    getByUserId(userId: ID): Promise<IProfileDTO[] | null>
    search(params: IProfileSearchParams): Promise<ISearchedProfileDTO[]>
    create(payload: IProfileCreate): Promise<IProfileDTO>
    update(id: ID, payload: IProfileUpdate): Promise<IProfileDTO | null>
}
