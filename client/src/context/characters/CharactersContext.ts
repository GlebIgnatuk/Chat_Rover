import { createContext } from 'react'

export interface ICharacter {
    _id: string
    name: string
    element: string
    sex: string
    accentColor: string
    photoUrl: string
}

export interface ICharactersContext {
    characters: ICharacter[]
    indexed: Record<string, ICharacter>
    loading: { is: true } | { is: false; error: string | null }
}

export const CharactersContext = createContext<ICharactersContext | undefined>(undefined)
