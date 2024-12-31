import { FlagIcon, FLAGS_MAP } from '@/components/FlagIcon'
import { SUPPORTED_SERVERS } from '@/config/config'
import { useStore } from '@/context/app/useStore'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { buildImageUrl } from '@/utils/url'
import {
    faMicrophoneAlt,
    faMicrophoneAltSlash,
    faPlus,
    faX,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { forwardRef, useMemo, useState } from 'react'
import { cn } from 'tailwind-cn'
import { ConstellationPicker } from './ConstellationPicker'

interface Props {
    onSubmit: () => void
    onClose: () => void
}

const elements = ['spectro', 'glacio', 'aero', 'havoc', 'electro', 'fusion'] as const

export const FiltersModal = forwardRef<HTMLDivElement, Props>(({ onClose, onSubmit }, ref) => {
    const characters = useWuwaCharacters((state) => state.items)
    const state = useStore((state) => state.community.filters)
    const [editingIndex, setEditingIndex] = useState(0)

    const [element, setElement] = useState<(typeof elements)[number] | null>(null)
    const filteredCharacters = useMemo(
        () => Object.values(characters).filter((c) => c.element === element || !element),
        [element, characters],
    )

    return (
        <div className="h-full overflow-hidden bg-stone-800/50" ref={ref}>
            <div className="h-full overflow-auto pb-2">
                <div className="flex justify-end p-2 px-3">
                    <FontAwesomeIcon
                        icon={faX}
                        className="text-white cursor-pointer"
                        onClick={onClose}
                    />
                </div>

                <div className="grid grid-cols-3 gap-2 px-2">
                    {state.team.map((t, idx) =>
                        t ? (
                            <div
                                key={idx}
                                className={cn(
                                    'bg-stone-800 cursor-pointer overflow-hidden rounded-xl h-56 relative border-2 border-stone-400',
                                    {
                                        'border-2 border-primary-700': editingIndex === idx,
                                    },
                                )}
                                onClick={() => setEditingIndex(idx)}
                            >
                                <img
                                    src={buildImageUrl(characters[t.characterId]?.photoPath ?? '')}
                                    className="w-full h-full object-cover object-top"
                                />

                                <div className="absolute bottom-0 left-0 w-full text-primary-700 bg-gradient-to-t from-stone-800 to-transparent pt-4 text-right font-medium text-xl">
                                    <div className="bg-stone-800 inline-block w-20 text-center rounded-tl-xl border-t border-l border-primary-700">
                                        {t.minConstellation} - {t.maxConstellation}
                                    </div>
                                </div>

                                <div
                                    className="absolute top-1 right-1 cursor-pointer"
                                    onClick={() => state.removeTeamMember(idx)}
                                >
                                    <FontAwesomeIcon
                                        icon={faX}
                                        className="text-red-500 bg-black/70 w-4 h-4 block rounded-full p-1"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div
                                key={idx}
                                className={cn(
                                    'bg-stone-800 h-56 rounded-xl border-stone-300 border-2 border-dashed flex items-center justify-center cursor-pointer',
                                    {
                                        'text-primary-700 border-primary-700': editingIndex === idx,
                                    },
                                )}
                                onClick={() => setEditingIndex(idx)}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className={cn('w-12 h-12', {
                                        'text-primary-700': editingIndex === idx,
                                        'text-stone-300': editingIndex !== idx,
                                    })}
                                />
                            </div>
                        ),
                    )}
                </div>

                <div className="bg-stone-800 py-2 px-3 mx-2 mt-2 rounded-xl">
                    <div
                        className={cn('text-sm mb-2 leading-none font-medium text-stone-400', {
                            'text-primary-700': state.team[editingIndex] !== null,
                        })}
                    >
                        Constellation
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)] items-center">
                        <ConstellationPicker
                            team={state.team}
                            editingIndex={editingIndex}
                            setTeamMemberMaxConstellation={state.setTeamMemberMaxConstellation}
                            setTeamMemberMinConstellation={state.setTeamMemberMinConstellation}
                        />
                    </div>
                </div>

                <div className="grid grid-rows-[max-content,180px] mt-2 mx-2">
                    <div className="flex justify-around bg-stone-800 border-b border-primary-700 rounded-t-xl p-2">
                        {elements.map((e) => (
                            <div
                                key={e}
                                onClick={() => setElement(e === element ? null : e)}
                                className={cn('text-stone-400 select-none', {
                                    'text-primary-700': element === e,
                                })}
                            >
                                {e}
                            </div>
                        ))}
                    </div>

                    <div className="overflow-hidden">
                        <div className="h-full overflow-auto bg-stone-800 rounded-b-xl grid grid-cols-4 justify-items-center gap-y-4 py-4">
                            {filteredCharacters.map((c) => (
                                <div key={c._id}>
                                    <img
                                        src={buildImageUrl(c.photoPath)}
                                        onClick={() => state.addTeamMember(editingIndex, c._id)}
                                        className={cn(
                                            'w-20 h-20 object-cover object-top rounded-full p-1 cursor-pointer select-none',
                                            {
                                                'ring-2 ring-primary-700 pointer-events-none':
                                                    state.team.some(
                                                        (t) => t?.characterId === c._id,
                                                    ),
                                            },
                                        )}
                                        style={{
                                            background: `linear-gradient(to bottom, ${c.accentColor}, transparent)`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-stone-800 p-2 px-3 mx-2 rounded-xl mt-2 flex flex-col gap-2 justify-center">
                    <div className="text-sm font-medium leading-none text-primary-700">
                        <span>Languages</span>
                        <span className="text-xs ml-2">({state.languages.length} / 4)</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {Object.keys(FLAGS_MAP).map((lang) => (
                            <div
                                key={lang}
                                className={cn(
                                    'cursor-pointer border-2 rounded-full p-1 border-transparent',
                                    {
                                        'border-primary-700': state.languages.includes(lang),
                                    },
                                )}
                                onClick={() => {
                                    if (state.languages.includes(lang)) {
                                        state.removeLanguage(lang)
                                    } else {
                                        if (state.languages.length >= 4) return
                                        state.addLanguage(lang)
                                    }
                                }}
                            >
                                <FlagIcon code={lang} className="w-8 h-8 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-[max-content,minmax(0,1fr)] mt-2 mx-2 gap-2">
                    <div className="bg-stone-800 p-2 px-3 rounded-xl flex flex-col gap-2 items-center justify-self-start">
                        <span className="text-sm font-medium leading-none text-primary-700">
                            Voice
                        </span>

                        <FontAwesomeIcon
                            icon={
                                state.usesVoice === undefined
                                    ? faMicrophoneAlt
                                    : state.usesVoice
                                      ? faMicrophoneAlt
                                      : faMicrophoneAltSlash
                            }
                            className={cn('cursor-pointer w-6 h-6 rounded-full p-1', {
                                'text-green-500': state.usesVoice === true,
                                'text-gray-300': state.usesVoice === undefined,
                                'text-red-500': state.usesVoice === false,
                            })}
                            onClick={() => {
                                if (state.usesVoice) {
                                    state.setVoice(false)
                                } else if (state.usesVoice === undefined) {
                                    state.setVoice(true)
                                } else {
                                    state.unsetVoice()
                                }
                            }}
                        />
                    </div>

                    <div className="bg-stone-800 p-2 px-3 rounded-xl flex gap-2 items-center">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium leading-none text-primary-700">
                                Server
                            </span>

                            <div className="flex flex-wrap">
                                {SUPPORTED_SERVERS.map((server) => (
                                    <div
                                        key={server}
                                        className={cn(
                                            'select-none cursor-pointer border-2 rounded-full p-1 border-transparent text-stone-300',
                                            {
                                                'text-primary-700': state.server === server,
                                            },
                                        )}
                                        onClick={() => {
                                            if (state.server === server) {
                                                state.unsetServer()
                                            } else {
                                                state.setServer(server)
                                            }
                                        }}
                                    >
                                        {server}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-2 mx-2">
                    <button
                        className="bg-stone-800 text-primary-700 border border-primary-700 px-6 py-2 rounded-2xl w-full"
                        onClick={onSubmit}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
})
