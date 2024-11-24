import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import cardBg from '@/assets/profile-card-bg.webp'
import { LevelDropdown } from './LevelDropdown'
import { ConstellationDropdown } from './ConstellationDropdown'
import { CharacterPicker } from './CharacterPicker'
import { ServerDropdown } from './ServerDropdown'
import { cn } from 'tailwind-cn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'
import { WorldLevelDropdown } from './WorldLevelDropdown'
import {
    CnFlagIcon,
    DeFlagIcon,
    EsFlagIcon,
    FrFlagIcon,
    JpFlagIcon,
    KrFlagIcon,
    UsFlagIcon,
} from '@/icons'
import { LanguageDropdown } from './LanguageDropdown'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'

export interface FormState {
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

interface Props {
    initialState?: FormState
    onSubmit: (data: FormState) => unknown
}

export const LANGS_MAP: Record<string, { icon: JSX.Element; label: string }> = {
    en: { icon: <UsFlagIcon className="rounded-full w-4 h-4" />, label: 'English' },
    'zh-CN': {
        icon: <CnFlagIcon className="rounded-full w-4 h-4" />,
        label: 'Chinise (simplified)',
    },
    'zh-HK': {
        icon: <CnFlagIcon className="rounded-full w-4 h-4" />,
        label: 'Chinise (traditional)',
    },
    ja: { icon: <JpFlagIcon className="rounded-full w-4 h-4" />, label: 'Japanese' },
    ko: { icon: <KrFlagIcon className="rounded-full w-4 h-4" />, label: 'Korean' },
    fr: { icon: <FrFlagIcon className="rounded-full w-4 h-4" />, label: 'French' },
    de: { icon: <DeFlagIcon className="rounded-full w-4 h-4" />, label: 'German' },
    es: { icon: <EsFlagIcon className="rounded-full w-4 h-4" />, label: 'Spanish' },
}

const initialState: FormState = {
    uid: 0,
    about: '',
    nickname: '',
    server: '',
    usesVoice: true,
    languages: [],
    worldLevel: 0,
    team: [null, null, null],
}

export const ProfileForm = (props: Props) => {
    const [state, setState] = useState<FormState>(props.initialState ?? initialState)
    const cardRef = useRef<HTMLDivElement | null>(null)

    const characters = useWuwaCharacters((state) => state.items)
    const filteredCharactersList = useMemo(() => {
        const list = Object.values(characters)
        const rovers = list.filter((c) => c.name.toLowerCase() === 'rover').map((c) => c._id)

        return list.filter((c) => {
            const hasSelected = state.team.some((t) => t?.characterId === c._id)
            if (hasSelected) return false

            const hasRover = state.team.some((t) => t && rovers.includes(t.characterId))
            return !hasRover || !rovers.includes(c._id)
        })
    }, [state.team, characters])

    const filteredLanguages = useMemo(() => {
        return Object.keys(LANGS_MAP)
            .filter((l) => state.languages.includes(l) === false)
            .map((l) => ({ key: l, value: LANGS_MAP[l]?.label ?? '-' }))
    }, [state.languages])

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        props.onSubmit(state)
    }

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
                            ? { characterId, constellation: 0, level: 0 }
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

    useEffect(() => {
        setState(props.initialState ?? initialState)
    }, [props.initialState])

    return (
        <form onSubmit={onSubmit} className="relative w-full h-full">
            <input
                type="submit"
                value="Save"
                className="sticky top-0 left-0 bg-[#90D8FF] text-[#131313] px-6 py-1 w-full z-20"
            />

            <div
                className="mx-auto my-3 relative w-full max-w-[370px] text-white text-sm rounded-xl overflow-hidden"
                ref={cardRef}
            >
                <div className="relative z-10">
                    <div className="bg-gradient-to-r from-[#ffc960]/25 to-[#5d3d0c]/75 py-3 flex justify-between items-center gap-1">
                        <div className="tracking-tighter pl-1 overflow-hidden text-ellipsis whitespace-nowrap grow font-medium">
                            Wuthering Waves ⟡ Покои Чанли
                        </div>

                        <ServerDropdown
                            selected={state.server}
                            onSelect={(server) => setServer(server)}
                        />
                    </div>

                    <div className="px-2 pt-1">
                        <div className="text-base">
                            <input
                                type="text"
                                className="text-white bg-transparent outline-none w-full"
                                placeholder="Your nickname..."
                                value={state.nickname}
                                maxLength={55}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                        <div className="text-xs flex gap-1">
                            <span className="shrink-0">UID:</span>
                            <input
                                type="text"
                                className="text-white bg-transparent outline-none grow"
                                placeholder="123456789"
                                value={state.uid}
                                maxLength={9}
                                onChange={(e) => setUid(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1 px-1">
                        {Array.from({ length: 3 }, (_, idx) => (
                            <div key={idx} className="relative">
                                <div className="relative overflow-hidden rounded-xl bg-red-400 h-60">
                                    {state.team[idx] && (
                                        <LevelDropdown
                                            level={state.team[idx].level}
                                            onChange={(level) => setLevel(idx, level)}
                                        />
                                    )}

                                    <CharacterPicker
                                        charactersPool={filteredCharactersList}
                                        allCharacters={characters}
                                        selected={state.team[idx]?.characterId}
                                        onSelect={(id) => selectCharacter(idx, id)}
                                    />
                                </div>

                                {state.team[idx] && (
                                    <ConstellationDropdown
                                        constellation={state.team[idx].constellation}
                                        onChange={(constellation) =>
                                            setConstellation(idx, constellation)
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="relative bg-[#FFFAE7] mx-1 mb-1 mt-4 p-2 pt-6 border-[#D8C9AD] rounded-xl overflow-hidden">
                        <textarea
                            className="text-[#7D7881] bg-[#FFFAE7] outline-none w-full h-24 block text-xs resize-none"
                            placeholder="Looking for rovers to play together..."
                            value={state.about}
                            maxLength={255}
                            onChange={(e) =>
                                setState((prev) => ({ ...prev, about: e.target.value }))
                            }
                        ></textarea>

                        <div className="flex absolute top-0 left-0 pointer-events-none bg-[#656169] rounded-br-xl">
                            <span
                                className={cn(
                                    'p-1 px-4 text-center bg-[#7D7881] text-[#FFFAE7] text-xs leading-none rounded-br-xl',
                                )}
                            >
                                About
                            </span>

                            <span
                                className={cn(
                                    'p-1 text-center w-16 text-[#FFFAE7] text-xs leading-none rounded-bl-xl',
                                    {
                                        'text-amber-500': 255 - state.about.length <= 30,
                                        'text-red-500': 255 === state.about.length,
                                    },
                                )}
                            >
                                {state.about.length} / {255}
                            </span>
                        </div>
                    </div>

                    <div className="relative bg-[#FFFAE7] mx-1 mb-1 mt-2 p-2 pt-5 border-[#D8C9AD] rounded-xl overflow-hidden">
                        <div className="text-[#7D7881] mb-10">TODO</div>

                        <div className="h-[1px] bg-[#D8C9AD] relative my-2">
                            <div className="w-1 h-1 bg-inherit rotate-45 absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="w-1 h-1 bg-inherit rotate-45 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        <div className="text-gray-500 space-y-1">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1 font-semibold content-center">
                                    World level
                                </div>
                                <div className="col-span-2 content-center">
                                    <WorldLevelDropdown
                                        level={state.worldLevel}
                                        onChange={(level) => setWorldLevel(level)}
                                    />
                                </div>
                            </div>

                            <hr className="text-gray-300" />

                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1 font-semibold content-center">Voice</div>
                                <div className="col-span-2 content-center">
                                    <FontAwesomeIcon
                                        icon={state.usesVoice ? faMicrophone : faMicrophoneSlash}
                                        className="block w-20 bg-[#90D8FF] rounded-xl py-1"
                                        onClick={() => toggleVoice()}
                                    />
                                </div>
                            </div>

                            <hr className="text-gray-300" />

                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1 font-semibold content-center">
                                    Languages
                                </div>
                                <div className="col-span-2 content-center flex gap-1">
                                    {state.languages.map((lang) => (
                                        <div
                                            key={lang}
                                            className="relative flex gap-[2px] items-center p-1 px-2 rounded-2xl bg-[#C3B6A0]"
                                            onClick={() => removeLanguage(lang)}
                                        >
                                            {LANGS_MAP[lang]?.icon}
                                            <span className="text-white text-xs select-none">
                                                {lang.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    ))}

                                    {state.languages.length < 4 && (
                                        <LanguageDropdown
                                            languages={filteredLanguages}
                                            onSelect={(lang) => addLanguage(lang)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex absolute top-0 left-0 pointer-events-none bg-[#656169] rounded-br-xl">
                            <span
                                className={cn(
                                    'p-1 px-4 text-center bg-[#7D7881] text-[#FFFAE7] text-xs leading-none rounded-br-xl',
                                )}
                            >
                                Info
                            </span>
                        </div>
                    </div>
                </div>

                <img
                    src={cardBg}
                    className="absolute top-0 left-0 w-full h-full object-center object-cover"
                />
            </div>
        </form>
    )
}
