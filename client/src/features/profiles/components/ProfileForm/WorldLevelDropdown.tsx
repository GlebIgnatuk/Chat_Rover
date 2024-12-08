import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { cn } from 'tailwind-cn'
import { useDropdown } from '@/hooks/common/useDropdown'

interface Props {
    hasError: boolean
    level?: number
    onChange?: (level: number) => void
}

export const WorldLevelDropdown = (props: Props) => {
    const dropdown = useDropdown({
        options: [
            { key: '-1', value: '—' },
            { key: '1', value: 'Rank 1' },
            { key: '2', value: 'Rank 2' },
            { key: '3', value: 'Rank 3' },
            { key: '4', value: 'Rank 4' },
            { key: '5', value: 'Rank 5' },
            { key: '6', value: 'Rank 6' },
            { key: '7', value: 'Rank 7' },
            { key: '8', value: 'Rank 8' },
        ],
        selected: props.level?.toString(),
        closeOnClickOutside: true,
    })

    const select = (key: string) => {
        dropdown.select(key)
        props.onChange?.(Number(key))
    }

    return (
        <div
            className={cn('relative bg-[#90D8FF] rounded-xl px-2 py-1 w-20', {
                'outline outline-red-600 shadow-[0_0_10px_0_rgba(255,0,0,0.5)] rounded-xl':
                    props.hasError,
            })}
            ref={dropdown.ref}
        >
            <div
                className="flex items-center justify-between"
                onClick={() => (dropdown.isOpen ? dropdown.close() : dropdown.open())}
            >
                <span className="select-none">{dropdown.selected?.value}</span>
                <FontAwesomeIcon icon={faChevronDown} className="w-2" />
            </div>

            <div
                className={cn(
                    'absolute top-[calc(100%+4px)] left-0 h-0 overflow-hidden bg-[#90D8FF]/90 w-full rounded-xl z-10',
                    {
                        'h-16': dropdown.isOpen,
                    },
                )}
            >
                <div className="h-full overflow-y-auto">
                    {dropdown.options.map((option) => (
                        <div
                            key={option.key}
                            className="hover:bg-[#90D8FF] p-1"
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
        </div>
    )
}
