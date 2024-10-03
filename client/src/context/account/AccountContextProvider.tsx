import { ReactNode, useEffect, useState } from 'react'
import { AccountContext, IAccountContext, IProfile } from './AccountContext'
import { api } from '@/services/api'

interface Props {
    children: ReactNode
}

export const AccountContextProvider = ({ children }: Props) => {
    const [profiles, setProfiles] = useState<IProfile[]>([])
    const [loading, setLoading] = useState<IAccountContext['loading']>({
        is: false,
        error: null,
    })

    const loadProfiles = async (signal?: AbortSignal) => {
        try {
            setLoading({ is: true })
            const response = await api<IProfile[]>(`/me/profiles`, { signal })
            if (response.success) {
                setProfiles(response.data)
                setLoading({ is: false, error: null })
            } else {
                // setLoading({ is: false, error: response.error })
                setProfiles([
                    {
                        _id: '1',
                        about: 'Hey',
                        languages: ['en', 'jp'],
                        nickname: '3 characters',
                        server: 'europe',
                        team: [
                            {
                                characterId: '1',
                                level: 77,
                                rank: 4,
                            },
                            {
                                characterId: '2',
                                level: 65,
                                rank: 0,
                            },
                            {
                                characterId: '3',
                                level: 80,
                                rank: 3,
                            },
                        ],
                        uid: 123456789,
                        usesVoice: true,
                        worldLevel: 213,
                    },
                    {
                        _id: '2',
                        about: 'Hey',
                        languages: ['en', 'jp'],
                        nickname: '2 characters',
                        server: 'europe',
                        team: [
                            {
                                characterId: '2',
                                level: 77,
                                rank: 4,
                            },
                            null,
                            {
                                characterId: '3',
                                level: 80,
                                rank: 3,
                            },
                        ],
                        uid: 123456789,
                        usesVoice: true,
                        worldLevel: 213,
                    },
                    {
                        _id: '3',
                        about: 'Hey',
                        languages: ['en', 'jp'],
                        nickname: '1 characters',
                        server: 'europe',
                        team: [
                            null,
                            {
                                characterId: '2',
                                level: 77,
                                rank: 4,
                            },
                            null,
                        ],
                        uid: 123456789,
                        usesVoice: true,
                        worldLevel: 213,
                    },
                ])
                setLoading({ is: false, error: null })
            }
        } catch (e) {
            console.error(e)
            setLoading({ is: false, error: 'Something went wrong' })
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        loadProfiles(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    const context: IAccountContext = {
        profiles,
        loading,
    }

    return <AccountContext.Provider value={context}>{children}</AccountContext.Provider>
}
