import { ReactNode, useEffect, useMemo, useState } from 'react'
import { CharactersContext, ICharacter, ICharactersContext } from './CharactersContext'
import { api } from '@/services/api'

interface Props {
    children: ReactNode
}

export const CharactersContextProvider = ({ children }: Props) => {
    const [characters, setCharacters] = useState<ICharacter[]>([])
    const [loading, setLoading] = useState<ICharactersContext['loading']>({
        is: false,
        error: null,
    })

    const indexed = useMemo(() => {
        return characters.reduce<Record<string, ICharacter>>((acc, n) => {
            acc[n._id] = n
            return acc
        }, {})
    }, [characters])

    const loadCharacters = async (signal?: AbortSignal) => {
        try {
            setLoading({ is: true })
            const response = await api<ICharacter[]>(`/wuwaCharacters`, { signal })
            if (response.success) {
                setCharacters(response.data)
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
        const abortController = new AbortController()
        loadCharacters(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    const context: ICharactersContext = {
        characters,
        indexed,
        loading,
    }

    return <CharactersContext.Provider value={context}>{children}</CharactersContext.Provider>
}
