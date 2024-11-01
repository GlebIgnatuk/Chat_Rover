import { ChatService } from "./chatService";
import { GlobalChatService } from "./globalChatService";
import { OnlineService } from "./onlineService";

export interface IServices {
    chat: ChatService
    globalChat: GlobalChatService
    online: OnlineService
}