import { IChatMessageRepository } from "./chatMessage";
import { IPrivateChatRepository } from "./privateChat";
import { IUserRepository } from "./user";

export interface IRepositories {
    chatMessage: IChatMessageRepository
    privateChat: IPrivateChatRepository
    user: IUserRepository
}