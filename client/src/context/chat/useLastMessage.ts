import { useContext } from 'react'
import { ChatContext } from './ChatContext'

export const useLastMessage = () => {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('ChatContext must be used within provider')
    }

    const { state } = context

    return state.chatsMessages.lastReceivedMessage
}
