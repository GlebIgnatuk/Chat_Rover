import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useDropdown } from './useDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cn } from 'tailwind-cn'

interface Props {
    constellation?: number
    onChange?: (level: number) => void
}

export const ConstellationDropdown = ({ constellation }: Props) => {
    const dropdown = useDropdown<number>({
        options: Array.from({ length: 7 }, (_, idx) => ({ key: idx.toString(), value: idx })),
        selected: constellation?.toString(),
        closeOnClickOutside: true,
    })

    return (
        <div
            ref={dropdown.ref}
            className={cn(
                'text-lg absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-10 w-10 rounded-full border-2 border-[#A17DA8] bg-[#EBC920] shadow-lg transition-all z-10',
                {
                    'w-10': dropdown.isOpen,
                },
            )}
        >
            <div
                className="h-full flex flex-col items-center justify-center"
                onClick={() => (dropdown.isOpen ? dropdown.close() : dropdown.open())}
            >
                <span className="select-none leading-none">{dropdown.selected?.value ?? '-'}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn('h-2 rotate-0 transition-all', {
                        'rotate-180': dropdown.isOpen,
                    })}
                />
            </div>

            <div
                className={cn(
                    'touch-pan-y scrollbar-none absolute w-0 h-0 opacity-0 overflow-y-auto shadow-lg left-0 top-[calc(100%+4px)] rounded-xl bg-[#EBC920]/80 select-none transition-[opacity,height] duration-300',
                    {
                        'w-full h-20 opacity-100': dropdown.isOpen,
                    },
                )}
            >
                {dropdown.options.map((option) => (
                    <div
                        key={option.key}
                        className={cn('hover:bg-[#EBC920] px-1 text-center', {
                            'bg-[#EBC920]': option.key === dropdown.selected?.key,
                        })}
                        onClick={() => {
                            dropdown.select(option.key)
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
