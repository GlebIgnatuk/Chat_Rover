import { ReactNode } from 'react'
import { IUser, IUserContext, UserContext } from './UserContext'

interface Props {
    children: ReactNode
    user: IUser
}

export const UserContextProvider = ({ children, user }: Props) => {
    const context: IUserContext = {
        user,
    }

    return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}
