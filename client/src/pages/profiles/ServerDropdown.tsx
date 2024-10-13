import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDropdown } from './useDropdown'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { cn } from 'tailwind-cn'

interface Props {
    selected?: string
    onSelect?: (server: string) => void
}

export const ServerDropdown = (props: Props) => {
    const dropdown = useDropdown({
        options: [
            { key: 'SEA', value: 'SEA' },
            { key: 'Asia', value: 'Asia' },
            { key: 'Europe', value: 'Europe' },
            { key: 'HMT', value: 'HMT' },
            { key: 'America', value: 'America' },
        ],
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
                className="bg-[#EDDAB8] text-[#776868] rounded-l-xl px-2 shrink-0 font-medium space-x-1"
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
                    'absolute top-[calc(100%+8px)] h-0 w-full rounded-l-xl bg-[#EDDAB8]/90 z-10 transition-[height] overflow-hidden',
                    {
                        'h-20': dropdown.isOpen,
                    },
                )}
            >
                <div className="overflow-y-auto h-full">
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
        </div>
    )
}
