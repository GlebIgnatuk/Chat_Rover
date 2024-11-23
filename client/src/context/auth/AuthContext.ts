import { IUser } from '@/store/types'

export interface IIdentity {
    identity: {
        id: number
        username: string
        first_name?: string
        last_name?: string
        language_code: string
        is_premium: boolean
        allows_write_to_pm: boolean
    }
    user: IUser
}
