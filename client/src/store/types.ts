export type IPrivateChat = {
    _id: string
}

export type IGlobalChat = {
    _id: string
    slug: string
}

export type IIntl = Record<string, string>

export type IAppConfig = {
    game: {
        languages: string[]
        servers: string[]
    }
    app: {
        languages: string[]
    }
}

export type IUser = {
    _id: string
    nickname: string
    language: string
    avatarUrl: string | null
    lastActivityAt: string
    state: 'created' | 'complete'
}

export type IPublicUser = Pick<
    IUser,
    '_id' | 'nickname' | 'language' | 'avatarUrl' | 'lastActivityAt'
>

export type ISearchedProfile = {
    _id: string
    user: IUser
    uid: number
    about: string
    nickname: string
    server: string
    usesVoice: boolean
    languages: string[]
    worldLevel: number
    team: {
        characterId: string
        constellation: number
        level: number
    }[]
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

export type IWuwaCharacter = {
    _id: string
    name: string
    element: string
    sex: string
    accentColor: string
    photoPath: string
    photoUrl: string
}
