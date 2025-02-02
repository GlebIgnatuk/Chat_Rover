import { IChatMessageRepository } from './chatMessage'
import { IPrivateChatRepository } from './privateChat'
import { IUserRepository } from './user'
import { IWuwaCharacterRepository } from './wuwaCharacter'
import { IProfileRepository } from './profile'
import { IGlobalChatRepository } from './globalChat'
import { IReportRepository } from './reports'
import { ITranslationRepository } from './translation'
import { IErrorRepository } from './error'
import { IProfileExportRepository } from './profileExport'
import { IGiveawayItemRepository } from './giveawayItem'
import { IExpressGiveawayRepository } from './expressGiveaway'
import { IBalancePromocodeRepository } from './balancePromocode'
import { IShopProductRepository } from './shopProduct'
import { IShopOrderRepository } from './shopOrder'

export interface IRepositories {
    balancePromocode: IBalancePromocodeRepository
    chatMessage: IChatMessageRepository
    privateChat: IPrivateChatRepository
    globalChat: IGlobalChatRepository
    report: IReportRepository
    user: IUserRepository
    wuwaCharacter: IWuwaCharacterRepository
    profile: IProfileRepository
    translation: ITranslationRepository
    error: IErrorRepository
    profileExport: IProfileExportRepository
    giveawayItem: IGiveawayItemRepository
    expressGiveaway: IExpressGiveawayRepository
    shopProduct: IShopProductRepository
    shopOrder: IShopOrderRepository
}
