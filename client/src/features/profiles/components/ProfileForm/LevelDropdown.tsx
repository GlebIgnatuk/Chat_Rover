import { useDropdown } from '@/hooks/common/useDropdown'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cn } from 'tailwind-cn'

interface Props {
    hasError: boolean
    level?: number
    onChange?: (level: number) => void
}

export const LevelDropdown = ({ level, ...props }: Props) => {
    const dropdown = useDropdown<number | string>({
        options: [{ key: '-1', value: '—' }].concat(
            Array.from({ length: 90 }, (_, idx) => ({
                key: (idx + 1).toString(),
                value: (idx + 1).toString(),
            })),
        ),
        selected: level?.toString(),
        closeOnClickOutside: true,
    })

    const select = (key: string) => {
        dropdown.select(key.toString())
        props.onChange?.(Number(key))
    }

    return (
        <div
            ref={dropdown.ref}
            className={cn(
                'absolute left-0 top-3 shadow-xl bg-[#EBC920] p-1 rounded-r-xl w-9 transition-all z-10',
                {
                    'w-3/5': dropdown.isOpen,
                    'outline outline-red-600 shadow-[0_0_10px_0_rgba(255,0,0,0.5)]': props.hasError,
                },
            )}
        >
            <div
                className="flex items-center justify-between"
                onClick={() => (dropdown.isOpen ? dropdown.close() : dropdown.open())}
            >
                <span className="grow select-none">{dropdown.selected?.value ?? '-'}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn('w-2 shrink-0 rotate-0 transition-all', {
                        'rotate-180': dropdown.isOpen,
                    })}
                />
            </div>

            <div
                className={cn(
                    'absolute w-0 h-0 opacity-0 scrollbar-none overflow-y-auto shadow-lg left-0 top-[calc(100%+4px)] rounded-r-xl bg-[#EBC920]/80 select-none transition-[opacity,height] duration-300',
                    {
                        'w-full h-20 opacity-100': dropdown.isOpen,
                    },
                )}
            >
                {dropdown.options.map((option) => (
                    <div
                        key={option.key}
                        className={cn('hover:bg-[#EBC920] px-1', {
                            'bg-[#EBC920]': option.key === dropdown.selected?.key,
                        })}
                        onClick={() => {
                            select(option.key)
                            dropdown.close()
                        }}
                    >
                        {option.value}
                    </div>
                ))}
            </div>
        </div>
    )
}
