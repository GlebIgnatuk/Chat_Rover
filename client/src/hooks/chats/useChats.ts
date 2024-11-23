import { useChatsService } from './useChatsService'
import { useEffect, useMemo } from 'react'
import { IPrivateChatWithMetadata } from '@/store/types'
import { useStore } from '@/context/app/useStore'

export type IPrivateChatWithLastMessage = IPrivateChatWithMetadata & {
    lastMessage: NonNullable<IPrivateChatWithMetadata['lastMessage']>
}

export const useChats = () => {
    const chats = useStore((state) => state.chats)
    const service = useChatsService()

    const ordered = useMemo(() => {
        return (
            Object.values(chats.items).filter(
                (c) => !!c.lastMessage,
            ) as IPrivateChatWithLastMessage[]
        ).sort(
            (a, b) =>
                new Date(b.lastMessage!.createdAt).getTime() -
                new Date(a.lastMessage!.createdAt).getTime(),
        )
    }, [chats.items])

    useEffect(() => {
        if (Object.keys(chats.items).length !== 0 || chats.loading.items.$?.is) return

        const abortController = new AbortController()
        service.load(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    return useMemo(
        () => ({
            chats: ordered,
            loading: chats.loading.items.$ ?? { is: false },
        }),
        [ordered, chats.loading.items.$],
    )
}
