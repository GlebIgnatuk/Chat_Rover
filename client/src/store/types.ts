export type IPrivateChat = {
    _id: string
}

export type IGlobalChat = {
    _id: string
    slug: string
}

export type IUser = {
    _id: string
    nickname: string
    avatarUrl: string | null
    lastActivityAt: string
    state: 'created' | 'complete'
}

export type IPrivateChatWithMetadata = {
    _id: string
    peer: IUser
    lastMessage: {
        chatId: string
        text: string
        createdAt: string
    } | null
}

export type IMessage = {
    _id: string
    chatId: string
    createdBy: {
        _id: string
        externalId: number
        language: string
        nickname: string
        profile: null
    }
    text: string
    type: string
    createdAt: string
    updatedAt: string
}

export type IMessageWithStatus = {
    message: IMessage
    status: 'pending' | 'sent' | 'errored'
    error: string | null
}
