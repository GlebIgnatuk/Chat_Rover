import { ReactNode, useEffect, useState } from 'react'
import { AccountContext, IAccountContext, IProfile } from './AccountContext'
import { api } from '@/services/api'
import { useCharacters } from '../characters'

interface Props {
    children: ReactNode
}

export const AccountContextProvider = ({ children }: Props) => {
    const [profiles, setProfiles] = useState<IProfile[]>([])
    const [loading, setLoading] = useState<IAccountContext['loading']>({
        is: false,
        error: null,
    })

    const characters = useCharacters()

    const loadProfiles = async (signal?: AbortSignal) => {
        try {
            setLoading({ is: true })
            const response = await api<IProfile[]>(`/me/profiles`, { signal })
            if (response.success) {
                setProfiles(response.data)
                setLoading({ is: false, error: null })
            } else {
                setLoading({ is: false, error: response.error })
            }
        } catch (e) {
            console.error(e)
            setLoading({ is: false, error: 'Something went wrong' })
        }
    }

    useEffect(() => {
        if (characters.loading.is || characters.loading.error) return

        const abortController = new AbortController()
        loadProfiles(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [characters])

    const context: IAccountContext = {
        profiles,
        loading,
    }

    return <AccountContext.Provider value={context}>{children}</AccountContext.Provider>
}
