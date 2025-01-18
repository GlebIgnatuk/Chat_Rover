import { ID } from './types'
import { IGiveawayItemDTO } from '@/models/giveawayItem'

export interface IGiveawayItemCreate {
    name: string
    photoPath: string
}

export interface IGiveawayItemRepository {
    get(id: ID): Promise<IGiveawayItemDTO | null>
    list(): Promise<IGiveawayItemDTO[]>
    create(payload: IGiveawayItemCreate): Promise<IGiveawayItemDTO>
    // patch(payload: IExpressGiveawayCreate): Promise<IExpressGiveawayDTO>
    delete(id: ID): Promise<void>
}
