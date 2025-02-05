import { PrivateChatService } from './privateChatService'
import { GlobalChatService } from './globalChatService'
import { OnlineService } from './onlineService'
import { TelegramApi } from '@/services/telegram'

export interface IServices {
    privateChat: PrivateChatService
    globalChat: GlobalChatService
    online: OnlineService
    telegramApi: TelegramApi
}
