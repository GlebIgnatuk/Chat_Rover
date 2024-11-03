import { PrivateChatService } from './privateChatService'
import { GlobalChatService } from './globalChatService'
import { OnlineService } from './onlineService'

export interface IServices {
    privateChat: PrivateChatService
    globalChat: GlobalChatService
    online: OnlineService
}
