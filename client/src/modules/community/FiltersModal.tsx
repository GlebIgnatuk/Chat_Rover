import { FlagIcon, FLAGS_MAP } from '@/components/FlagIcon'
import { SUPPORTED_SERVERS } from '@/config/config'
import { useStore } from '@/context/app/useStore'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { faCheck, faPlus, faPlusMinus, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { forwardRef, useState } from 'react'
import { cn } from 'tailwind-cn'

interface Props {
    onSubmit: () => void
    onClose: () => void
}

export const FiltersModal = forwardRef<HTMLDivElement, Props>(({ onClose, onSubmit }, ref) => {
    const characters = useWuwaCharacters((state) => state.items)
    const state = useStore((state) => state.community.filters)
    const [editingIndex, setEditingIndex] = useState(0)

    return (
        <div className="h-full overflow-hidden bg-cyan-700/70" ref={ref}>
            <div className="h-full overflow-auto">
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
                                    'bg-white overflow-hidden rounded-xl h-44 relative border-2 border-transparent',
                                    {
                                        'border-2 border-red-500': editingIndex === idx,
                                    },
                                )}
                                onClick={() => setEditingIndex(idx)}
                            >
                                <img src={characters[t.characterId]?.photoUrl} className="" />
                                <div className="absolute bottom-0 left-0 w-full text-white bg-gradient-to-t from-black to-transparent py-2 text-center font-semibold text-xl">
                                    {t.minConstellation} - {t.maxConstellation}
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
                                    'bg-white h-44 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer',
                                    {
                                        'border-red-500': editingIndex === idx,
                                    },
                                )}
                                onClick={() => setEditingIndex(idx)}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className={cn('w-12 h-12', {
                                        'text-red-500': editingIndex === idx,
                                        'text-black': editingIndex !== idx,
                                    })}
                                />
                            </div>
                        ),
                    )}
                </div>

                <div className="grid grid-rows-[max-content,140px] mt-2 mx-2">
                    <div className="flex justify-around bg-white rounded-xl p-2">
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                    </div>

                    <div className="overflow-hidden py-2">
                        <div className="h-full overflow-auto bg-black/20 rounded-xl grid grid-cols-4 justify-items-center gap-y-4 py-4">
                            {Object.values(characters).map((c) => (
                                <div key={c._id}>
                                    <img
                                        src={c.photoUrl}
                                        onClick={() => state.addTeamMember(editingIndex, c._id)}
                                        className={cn(
                                            'w-20 h-20 object-cover object-top rounded-full bg-white cursor-pointer',
                                            {
                                                'border-2 border-cyan-500': state.team.some(
                                                    (t) => t?.characterId === c._id,
                                                ),
                                            },
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white py-2 px-3 mx-2 rounded-xl">
                    <div className="text-center mb-2 leading-none font-semibold">Constellation</div>

                    <div className="grid grid-cols-[minmax(0,1fr)] items-center">
                        <div className="grid grid-cols-[max-content,repeat(6,minmax(0,1fr))]">
                            {Array.from({ length: 7 }, (_, idx) => (
                                <div className="flex items-center">
                                    <div
                                        className={cn('h-2 grow bg-cyan-700 -mx-1', {
                                            'bg-cyan-700': state.team[editingIndex]
                                                ? idx - 1 >=
                                                      state.team[editingIndex].minConstellation &&
                                                  idx - 1 <=
                                                      state.team[editingIndex].maxConstellation
                                                : false,
                                            'bg-gray-300': state.team[editingIndex]
                                                ? idx - 1 <
                                                      state.team[editingIndex].minConstellation ||
                                                  idx - 1 >
                                                      state.team[editingIndex].maxConstellation
                                                : true,
                                            'w-0 h-0': idx === 0,
                                        })}
                                    ></div>

                                    <div
                                        className={cn(
                                            'select-none relative z-10 w-6 h-6 rounded-full text-white flex items-center justify-center cursor-pointer',
                                            {
                                                'bg-cyan-700': state.team[editingIndex]
                                                    ? idx >=
                                                          state.team[editingIndex]
                                                              .minConstellation &&
                                                      idx <=
                                                          state.team[editingIndex].maxConstellation
                                                    : false,
                                                'bg-gray-300': state.team[editingIndex]
                                                    ? idx <
                                                          state.team[editingIndex]
                                                              .minConstellation ||
                                                      idx >
                                                          state.team[editingIndex].maxConstellation
                                                    : true,
                                                'pointer-events-none':
                                                    state.team[editingIndex] === null,
                                            },
                                        )}
                                        onClick={() => {
                                            const member = state.team[editingIndex]
                                            if (!member) return

                                            if (idx < member.minConstellation) {
                                                state.setTeamMemberMinConstellation(
                                                    editingIndex,
                                                    idx,
                                                )
                                            } else if (idx < member.maxConstellation) {
                                                state.setTeamMemberMinConstellation(
                                                    editingIndex,
                                                    idx,
                                                )
                                            } else if (idx > member.maxConstellation) {
                                                state.setTeamMemberMaxConstellation(
                                                    editingIndex,
                                                    idx,
                                                )
                                            } else {
                                                state.setTeamMemberMaxConstellation(
                                                    editingIndex,
                                                    idx,
                                                )
                                            }
                                        }}
                                    >
                                        {idx}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-2 mx-2 rounded-xl mt-2 flex gap-2 items-center">
                    <div className="text-center leading-none">Languages:</div>
                    <div className="flex gap-2">
                        {Object.keys(FLAGS_MAP).map((lang) => (
                            <div
                                key={lang}
                                className={cn(
                                    'cursor-pointer border-2 rounded-full p-1 border-transparent',
                                    {
                                        'border-black': state.languages.includes(lang),
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
                                <FlagIcon code={lang} className="w-4 h-4 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-2 mx-2 rounded-xl mt-2 flex gap-2 items-center">
                    <div className="flex items-center gap-2">
                        <span>Voice: </span>

                        <FontAwesomeIcon
                            icon={
                                state.usesVoice === undefined
                                    ? faPlusMinus
                                    : state.usesVoice
                                      ? faCheck
                                      : faX
                            }
                            className={cn(
                                'cursor-pointer w-4 h-4 border border-black rounded-full p-1',
                                {
                                    'text-green-500': state.usesVoice === true,
                                    'text-gray-300': state.usesVoice === undefined,
                                    'text-red-500': state.usesVoice === false,
                                },
                            )}
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
                </div>

                <div className="bg-white p-2 mx-2 rounded-xl mt-2 flex gap-2 items-center">
                    <div className="flex items-center gap-2">
                        <span>Server: </span>

                        <div className="flex gap-2">
                            {SUPPORTED_SERVERS.map((server) => (
                                <div
                                    key={server}
                                    className={cn(
                                        'select-none cursor-pointer border-2 rounded-full p-1 border-transparent',
                                        {
                                            'border-black': state.server === server,
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

                <div className="mt-2 mx-2">
                    <button
                        className="bg-black text-cyan-300 px-6 py-2 rounded-2xl w-full"
                        onClick={onSubmit}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
})
