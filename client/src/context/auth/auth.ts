import { IIdentity } from '@/context/auth/AuthContext'

export type ProfileState = 'unauthenticated' | 'created' | 'complete'

export const inferProfileState = (user?: IIdentity | null) => {
    if (!user) {
        return 'unauthenticated'
    }

    switch (user.user.state) {
        case 'complete': {
            return 'complete'
        }
        case 'created': {
            return 'created'
        }
        default: {
            throw new Error(`Invalid user state: '${user.user.state}'`)
        }
    }
}

export const clearTelegramData = () => {
    window.localStorage.removeItem('__telegram__initParams')
    window.sessionStorage.removeItem('__telegram__initParams')
}
