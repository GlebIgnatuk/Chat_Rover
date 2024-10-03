import { useEffect, useState } from 'react'
import cardBg from '@/assets/profile-card-bg.webp'
import Changli from '@/assets/Changli.png'

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
        rank: number
    } | null>
}

interface Props {
    initialState?: FormState
    onSubmit: (data: FormState) => unknown
}

const initialState: FormState = {
    uid: 0,
    about: '',
    nickname: '',
    server: '',
    usesVoice: true,
    languages: [],
    worldLevel: 0,
    team: [],
}

const images: Record<string, string> = {
    '1': Changli,
    '2': Changli,
    '3': Changli,
}

export const ProfileForm = (props: Props) => {
    const [state, setState] = useState<FormState>(props.initialState ?? initialState)

    const onSubmit = () => {
        props.onSubmit(state)
    }

    useEffect(() => {
        setState(props.initialState ?? initialState)
    }, [props.initialState])

    return (
        <form onSubmit={onSubmit} className="w-full h-full">
            <div className="mx-auto relative w-full max-w-[370px] text-white text-sm rounded-xl overflow-hidden">
                <div className="relative z-10">
                    <div className="bg-gradient-to-r from-[#ffc960]/25 to-[#5d3d0c]/75 py-3 flex justify-between items-center gap-1">
                        <div className="tracking-tighter pl-1 overflow-hidden text-ellipsis whitespace-nowrap grow font-medium">
                            Wuthering Waves ⟡ Покои Чанли
                        </div>

                        <div className="capitalize bg-[#EDDAB8] text-[#776868] rounded-l-xl px-2 shrink-0 font-medium">
                            {state.server}
                        </div>
                    </div>

                    <div className="px-2 pt-1">
                        <div className="text-base">{state.nickname}</div>
                        <div className="text-xs">UID: {state.uid}</div>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1 px-1">
                        {Array.from({ length: 3 }, (_, idx) => (
                            <div key={idx} className="relative">
                                <div className="relative overflow-hidden rounded-xl bg-red-400 h-60">
                                    <div className="absolute left-0 top-3 bg-[#EBC920] pl-1 pr-2 rounded-r-xl">
                                        {state.team[idx]?.level ?? 0}
                                    </div>

                                    {state.team[idx] ? (
                                        <img
                                            src={images[state.team[idx].characterId]}
                                            className="w-full h-full object-cover object-bottom"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-t from-gray-500 to-gray-700 text-8xl flex items-center justify-center">
                                            <span className="rotate-45">×</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-lg flex items-center justify-center absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-8 w-8 rounded-full border-2 border-[#A17DA8] bg-[#EBC920] shadow-lg">
                                    {state.team[idx]?.rank ?? 0}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#FFFAE7] mx-1 mb-1 mt-2 p-2 pt-3 border-[#D8C9AD] rounded-xl overflow-hidden">
                        <textarea
                            className="text-[#7D7881] bg-[#FFFAE7] outline-none w-full h-16 block text-xs"
                            placeholder="About..."
                            value={state.about}
                            onChange={(e) =>
                                setState((prev) => ({ ...prev, about: e.target.value }))
                            }
                        ></textarea>
                    </div>

                    <div className="bg-[#FFFAE7] mx-1 mb-1 mt-2 p-2 pt-3 border-[#D8C9AD] rounded-xl overflow-hidden">
                        <div className="text-[#7D7881] mb-6">TODO</div>

                        <div className="h-[1px] bg-[#D8C9AD] relative my-2">
                            <div className="w-1 h-1 bg-inherit rotate-45 absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="w-1 h-1 bg-inherit rotate-45 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        <div className="text-[#7D7881] mt-14">TODO</div>
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
