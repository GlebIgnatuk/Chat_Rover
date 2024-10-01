import { createContext } from 'react'
import { IState } from './reducer'

export interface IChatContext {
    state: IState
    loadChats: (signal?: AbortSignal) => Promise<void>
    loadChat: (chatId: string, signal?: AbortSignal) => Promise<void>
    loadChatByPeer: (peerId: string, signal?: AbortSignal) => Promise<void>
    loadChatMessages: (chatId: string, signal?: AbortSignal) => Promise<void>
    sendChatMessage: (chatId: string, text: string, signal?: AbortSignal) => Promise<void>
}

export const ChatContext = createContext<IChatContext | undefined>(undefined)
