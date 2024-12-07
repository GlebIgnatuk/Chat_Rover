import { FormEvent } from 'react'
import cardBg from '@/assets/profile-card-bg.webp'
import { LevelDropdown } from './LevelDropdown'
import { ConstellationDropdown } from './ConstellationDropdown'
import { CharacterPicker } from './CharacterPicker'
import { ServerDropdown } from './ServerDropdown'
import { cn } from 'tailwind-cn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'
import { WorldLevelDropdown } from './WorldLevelDropdown'
import { LanguageDropdown } from './LanguageDropdown'
import { UseProfileFormResult } from '../../hooks/useProfileForm'
import { FlagIcon } from '@/components/FlagIcon'

interface Props {
    form: UseProfileFormResult
}

export const ProfileForm = ({ form }: Props) => {
    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={onSubmit} className="relative max-w-[370px] w-full h-full">
            <div className="mx-auto relative w-full text-white text-sm rounded-xl overflow-hidden">
                <div className="relative z-10">
                    <div className="bg-gradient-to-r from-[#ffc960]/25 to-[#5d3d0c]/75 py-3 flex justify-between items-center gap-1">
                        <div className="tracking-tighter pl-1 overflow-hidden text-ellipsis whitespace-nowrap grow font-medium">
                            Wuthering Waves ⟡ Покои Чанли
                        </div>

                        <ServerDropdown
                            options={form.servers}
                            selected={form.state.server}
                            onSelect={(server) => form.setServer(server)}
                        />
                    </div>

                    <div className="px-2 pt-1">
                        <div className="text-base">
                            <input
                                type="text"
                                className="text-white bg-transparent outline-none w-full"
                                placeholder="Your nickname..."
                                value={form.state.nickname}
                                maxLength={55}
                                onChange={(e) => form.setNickname(e.target.value)}
                            />
                        </div>
                        <div className="text-xs flex gap-1">
                            <span className="shrink-0">UID:</span>
                            <input
                                type="text"
                                className="text-white bg-transparent outline-none grow"
                                placeholder="123456789"
                                value={form.state.uid}
                                maxLength={9}
                                onChange={(e) => form.setUid(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1 px-1">
                        {Array.from({ length: 3 }, (_, idx) => (
                            <div key={idx} className="relative">
                                <div className="relative overflow-hidden rounded-xl bg-red-400 h-60">
                                    {form.state.team[idx] && (
                                        <LevelDropdown
                                            level={form.state.team[idx].level}
                                            onChange={(level) => form.setLevel(idx, level)}
                                        />
                                    )}

                                    <CharacterPicker
                                        charactersPool={form.filteredCharacters}
                                        allCharacters={form.allCharacters}
                                        selected={form.state.team[idx]?.characterId}
                                        onSelect={(id) => form.selectCharacter(idx, id)}
                                    />
                                </div>

                                {form.state.team[idx] && (
                                    <ConstellationDropdown
                                        constellation={form.state.team[idx].constellation}
                                        onChange={(constellation) =>
                                            form.setConstellation(idx, constellation)
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
                            maxLength={255}
                            value={form.state.about}
                            onChange={(e) => form.setAbout(e.target.value)}
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
                                        'text-amber-500': 255 - form.state.about.length <= 30,
                                        'text-red-500': 255 === form.state.about.length,
                                    },
                                )}
                            >
                                {form.state.about.length} / {255}
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
                                        level={form.state.worldLevel}
                                        onChange={(level) => form.setWorldLevel(level)}
                                    />
                                </div>
                            </div>

                            <hr className="text-gray-300" />

                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1 font-semibold content-center">Voice</div>
                                <div className="col-span-2 content-center">
                                    <FontAwesomeIcon
                                        icon={
                                            form.state.usesVoice ? faMicrophone : faMicrophoneSlash
                                        }
                                        className="block w-20 bg-[#90D8FF] rounded-xl py-1"
                                        onClick={() => form.toggleVoice()}
                                    />
                                </div>
                            </div>

                            <hr className="text-gray-300" />

                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1 font-semibold content-center">
                                    Languages
                                </div>
                                <div className="col-span-2 content-center flex gap-1">
                                    {form.state.languages.map((lang) => (
                                        <div
                                            key={lang}
                                            className="relative flex gap-[2px] items-center p-1 px-2 rounded-2xl bg-[#C3B6A0]"
                                            onClick={() => form.removeLanguage(lang)}
                                        >
                                            <FlagIcon
                                                code={lang}
                                                className="w-4 h-4 rounded-full"
                                            />
                                            <span className="text-white text-xs select-none">
                                                {lang.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    ))}

                                    {form.state.languages.length < 4 && (
                                        <LanguageDropdown
                                            languages={form.filteredLanguages}
                                            onSelect={(lang) => form.addLanguage(lang)}
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
