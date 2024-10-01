import { useContext, useMemo } from 'react'
import { ChatContext } from './ChatContext'
import { IPrivateChatWithMetadata } from './reducer'

export type IPrivateChatWithLastMessage = IPrivateChatWithMetadata & {
    lastMessage: NonNullable<IPrivateChatWithMetadata['lastMessage']>
}

export const useChats = () => {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('ChatContext must be used within provider')
    }

    const { state } = context

    const orderedChats = useMemo(
        () =>
            (
                Object.values(state.chats.items).filter(
                    (c) => !!c.lastMessage,
                ) as IPrivateChatWithLastMessage[]
            ).sort(
                (a, b) =>
                    new Date(b.lastMessage!.createdAt).getTime() -
                    new Date(a.lastMessage!.createdAt).getTime(),
            ),
        [state.chats.items],
    )

    return {
        chats: orderedChats,
        loading: state.chats.loading,
    }
}
