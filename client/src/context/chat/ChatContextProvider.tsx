import { ReactNode } from "react"
import { ChatContext, IChatContext } from "./ChatContext"

interface Props {
    children: ReactNode
}

export const ChatContextProvider = ({ children }: Props) => {

    const context: IChatContext = {
        
    }

    return <ChatContext.Provider value={context}>
        {children}
    </ChatContext.Provider>
}