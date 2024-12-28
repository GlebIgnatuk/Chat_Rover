import { ICommunityState } from '@/store/state'
import { useEffect, useState } from 'react'
import { cn } from 'tailwind-cn'

export interface ConstellationPickerProps {
    editingIndex: number
    team: ICommunityState['community']['filters']['team']
    setTeamMemberMinConstellation: (idx: number, value: number) => void
    setTeamMemberMaxConstellation: (idx: number, value: number) => void
}

export const ConstellationPicker = ({ editingIndex, team, ...props }: ConstellationPickerProps) => {
    const [isSecondClick, setIsSecondClick] = useState(false)

    const handleFirstClick = (idx: number, value: number) => {
        const member = team[idx]
        if (!member) return

        if (value <= member.maxConstellation) {
            props.setTeamMemberMinConstellation(idx, value)
            setIsSecondClick(true)
        } else {
            props.setTeamMemberMaxConstellation(idx, value)
            setIsSecondClick(false)
        }
    }

    const handleSecondClick = (idx: number, value: number) => {
        const member = team[idx]
        if (!member) return

        if (value < member.minConstellation) {
            props.setTeamMemberMinConstellation(idx, value)
            setIsSecondClick(true)
        } else {
            props.setTeamMemberMaxConstellation(idx, value)
            setIsSecondClick(false)
        }
    }

    useEffect(() => {
        setIsSecondClick(false)
    }, [editingIndex])

    return (
        <div className="grid grid-cols-[1.5rem,repeat(6,minmax(0,1fr))]">
            {Array.from({ length: 7 }, (_, idx) => (
                <div className="flex items-center">
                    <div
                        className={cn('h-2 grow bg-stone-600 -mx-1', {
                            'bg-primary-700': team[editingIndex]
                                ? idx - 1 >= team[editingIndex].minConstellation &&
                                  idx - 1 < team[editingIndex].maxConstellation
                                : false,
                            'bg-stone-600': team[editingIndex]
                                ? idx - 1 < team[editingIndex].minConstellation ||
                                  idx - 1 > team[editingIndex].maxConstellation
                                : true,
                            'w-0 h-0': idx === 0,
                        })}
                    ></div>

                    <div
                        className={cn(
                            'select-none relative z-10 w-6 h-6 rounded-full text-white flex items-center justify-center cursor-pointer',
                            {
                                'bg-primary-700': team[editingIndex]
                                    ? idx >= team[editingIndex].minConstellation &&
                                      idx <= team[editingIndex].maxConstellation
                                    : false,
                                'bg-stone-600': team[editingIndex]
                                    ? idx < team[editingIndex].minConstellation ||
                                      idx > team[editingIndex].maxConstellation
                                    : true,
                                'pointer-events-none': team[editingIndex] === null,
                            },
                        )}
                        onClick={() => {
                            if (isSecondClick) {
                                handleSecondClick(editingIndex, idx)
                            } else {
                                handleFirstClick(editingIndex, idx)
                            }
                        }}
                    >
                        {idx}
                    </div>
                </div>
            ))}
        </div>
    )
}
