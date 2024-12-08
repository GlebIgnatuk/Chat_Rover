import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { cn } from 'tailwind-cn'
import { useDropdown } from '@/hooks/common/useDropdown'

interface Props {
    hasError: boolean
    options: { key: string; value: string }[]
    selected?: string
    onSelect?: (server: string) => void
}

export const ServerDropdown = (props: Props) => {
    const dropdown = useDropdown({
        options: props.options,
        closeOnClickOutside: true,
        selected: props.selected,
    })

    const select = (server: string) => {
        dropdown.select(server)
        props.onSelect?.(server)
    }

    return (
        <div className="relative shrink-0" ref={dropdown.ref}>
            <div
                className={cn(
                    'bg-[#EDDAB8] text-[#776868] rounded-l-xl px-2 shrink-0 font-medium space-x-1',
                    {
                        'outline outline-red-600 shadow-[0_0_10px_0_rgba(255,0,0,0.5)]':
                            props.hasError,
                    },
                )}
                onClick={() => (dropdown.isOpen ? dropdown.close() : dropdown.open())}
            >
                <div className="inline-block w-14 select-none">
                    <span
                        className={cn({
                            capitalize: !!dropdown.selected,
                        })}
                    >
                        {dropdown.selected?.value ?? '—'}
                    </span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className="text-[#776868] w-2 shrink-0" />
            </div>

            <div
                className={cn(
                    'absolute top-[calc(100%+8px)] overflow-y-auto h-0 w-full rounded-l-xl bg-[#EDDAB8]/90 z-10 transition-[height]',
                    {
                        'h-20': dropdown.isOpen,
                    },
                )}
            >
                {dropdown.options.map((option) => (
                    <div
                        key={option.key}
                        className="text-xs text-[#776868] px-2 py-1 select-none hover:bg-[#EDDAB8]"
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
