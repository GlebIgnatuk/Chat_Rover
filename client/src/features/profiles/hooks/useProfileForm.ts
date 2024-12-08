import { IWuwaCharacter } from '@/store/types'
import { useMemo, useState } from 'react'
import * as R from 'ramda'

export interface ProfileFormState {
    uid: number
    about: string
    nickname: string
    server: string
    usesVoice: boolean
    languages: string[]
    worldLevel: number
    team: Array<{
        characterId: string
        level: number
        constellation: number
    } | null>
}

const defaultState: ProfileFormState = {
    uid: 0,
    about: '',
    nickname: '',
    server: '',
    usesVoice: true,
    languages: [],
    worldLevel: -1,
    team: [null, null, null],
}

export interface UseProfileFormOptions {
    initialState?: ProfileFormState
    languages: { key: string; value: string }[]
    servers: { key: string; value: string }[]
    characters: Record<string, IWuwaCharacter>
}

export type UseProfileFormResult = ReturnType<typeof useProfileForm>

export const useProfileForm = (props: UseProfileFormOptions) => {
    const [state, setState] = useState<ProfileFormState>(props.initialState ?? defaultState)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const filteredLanguages = useMemo(() => {
        return props.languages.filter((pl) => state.languages.some((sl) => sl === pl.key) === false)
    }, [props.languages, state.languages])

    const filteredCharacters = useMemo(() => {
        const list = Object.values(props.characters)
        const rovers = list.filter((c) => c.name.toLowerCase() === 'rover').map((c) => c._id)

        return list.filter((c) => {
            const hasSelected = state.team.some((t) => t?.characterId === c._id)
            if (hasSelected) return false

            const hasRover = state.team.some((t) => t && rovers.includes(t.characterId))
            return !hasRover || !rovers.includes(c._id)
        })
    }, [state.team])

    const setConstellation = (of: number, value: number) => {
        setState((prev) => {
            return {
                ...prev,
                team: prev.team.map((m, idx) =>
                    idx === of && m ? { ...m, constellation: value } : m,
                ),
            }
        })
    }

    const setLevel = (of: number, value: number) => {
        setState((prev) => {
            return {
                ...prev,
                team: prev.team.map((m, idx) => (idx === of && m ? { ...m, level: value } : m)),
            }
        })
    }

    const selectCharacter = (of: number, characterId: string | null) => {
        setState((prev) => {
            return {
                ...prev,
                team: prev.team.map((m, idx) =>
                    idx === of
                        ? characterId
                            ? { characterId, constellation: -1, level: -1 }
                            : null
                        : m,
                ),
            }
        })
    }

    const setNickname = (nickname: string) => {
        setState((prev) => ({ ...prev, nickname }))
    }

    const setServer = (server: string) => {
        setState((prev) => ({ ...prev, server }))
    }

    const setWorldLevel = (worldLevel: number) => {
        setState((prev) => ({ ...prev, worldLevel }))
    }

    const toggleVoice = () => {
        setState((prev) => ({ ...prev, usesVoice: !prev.usesVoice }))
    }

    const addLanguage = (lang: string) => {
        setState((prev) => ({ ...prev, languages: [...prev.languages, lang] }))
    }

    const removeLanguage = (lang: string) => {
        setState((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }))
    }

    const setUid = (uid: string) => {
        if (/^\d*$/.test(uid) === false) return

        setState((prev) => ({ ...prev, uid: Number(uid) }))
    }

    const setAbout = (about: string) => {
        setState((prev) => ({ ...prev, about }))
    }

    const addErrors = (...errors: { key: string; message: string }[]) => {
        setErrors((prev) => {
            const obj = { ...prev }
            for (const error of errors) {
                obj[error.key] = error.message
            }
            return obj
        })
    }

    const cleanError = (key: string) => {
        setErrors((prev) => R.dissoc(key, prev))
    }

    const cleanErrors = () => {
        setErrors({})
    }

    return {
        state,
        errors,
        allLanguages: props.languages,
        filteredLanguages,
        allCharacters: props.characters,
        filteredCharacters,
        servers: props.servers,
        setConstellation,
        setLevel,
        selectCharacter,
        setNickname,
        setServer,
        setWorldLevel,
        toggleVoice,
        addLanguage,
        removeLanguage,
        setUid,
        setAbout,
        addErrors,
        cleanError,
        cleanErrors,
    }
}
