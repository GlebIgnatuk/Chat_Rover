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
            const response = await api<IProfile[]>(`/profiles`, { signal })
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
                                characterId: characters.characters[0]!._id,
                                level: 77,
                                constellation: 4,
                            },
                            {
                                characterId: characters.characters[6]!._id,
                                level: 65,
                                constellation: 0,
                            },
                            {
                                characterId: characters.characters[14]!._id,
                                level: 80,
                                constellation: 3,
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
                                characterId: characters.characters[8]!._id,
                                level: 77,
                                constellation: 4,
                            },
                            null,
                            {
                                characterId: characters.characters[18]!._id,
                                level: 80,
                                constellation: 3,
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
                                characterId: characters.characters[17]!._id,
                                level: 77,
                                constellation: 4,
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
