import { useAuth } from './useAuth'

export const useUser = () => {
    const { user } = useAuth()

    if (!user) {
        throw new Error('User not initialized')
    }

    return user
}
