export type IPrivateChatWithMetadata = {
    _id: string
    peer: {
        _id: string
        nickname: string
        avatarUrl: string | null
    }
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
