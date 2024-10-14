import { ChatService } from "./chatService";
import { OnlineService } from "./onlineService";

export interface IServices {
    chat: ChatService
    online: OnlineService
}