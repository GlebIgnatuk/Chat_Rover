export type IPrivateChat = {
    _id: string
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
    externalId: number
    nickname: string
    language: string
    avatarUrl: string | null
    lastActivityAt: string
    dailyBonusCollectedAt: string
    state: 'created' | 'complete'
    balance: number
    role: string
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

export type IGlobalChat = {
    _id: string
    title: string
    slug: string
    description: string
}

export type IGlobalChatWithMetadata = IGlobalChat & {
    activeSubscribers: number
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

export type IListingExpressGiveaway = {
    _id: string
    name: string
    cost: number

    participants: number
    minParticipants: number
    maxParticipants: number

    maxWinners: number
    winners: IPublicUser[]

    giveawayItem: {
        _id: string
        name: string
        photoPath: string
    }

    durationInSeconds: number
    startedAt: string | null
    finishedAt: string | null
    createdAt: string

    isParticipating: boolean
}

export type IAdminExpressGiveawayListItem = {
    _id: string
    name: string

    participants: number
    maxParticipants: number

    winners: (Pick<IUser, '_id' | 'nickname'> & { processed: boolean })[]

    giveawayItem: {
        _id: string
        name: string
        photoPath: string
    }

    finishedAt: string
}

export type IShopProduct = {
    _id: string
    name: string
    photoPath: string
    category: string

    prices: {
        currency: 'XLNT' | 'RUB'
        price: number
        discount: number
        discountEndsAt: Date | null
    }[]
    mode: 'request' | 'instant'
}
