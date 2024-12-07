import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { cn } from 'tailwind-cn'
import { useDropdown } from '@/hooks/common/useDropdown'
import { FlagIcon } from '@/components/FlagIcon'

interface Props {
    languages: { key: string; value: string }[]
    onSelect: (lang: string) => void
}

export const LanguageDropdown = (props: Props) => {
    const dropdown = useDropdown({
        options: props.languages,
        closeOnClickOutside: true,
    })

    return (
        <div className="relative" ref={dropdown.ref}>
            <div
                className="flex gap-1 items-center p-1 rounded-2xl bg-[#C3B6A0]"
                onClick={() => (dropdown.isOpen ? dropdown.close() : dropdown.open())}
                ref={dropdown.ref}
            >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-white" />
            </div>

            <div
                className={cn(
                    'absolute -top-1 -translate-y-full right-0 h-0 overflow-hidden flex flex-col bg-[#C3B6A0]/90 rounded-xl',
                    {
                        'h-auto max-h-24 max-w-36': dropdown.isOpen,
                    },
                )}
            >
                <div className="overflow-y-auto">
                    {dropdown.options.map((option) => (
                        <div
                            key={option.key}
                            title={option.value}
                            className="flex items-center gap-1 text-white px-2 py-1 hover:bg-[#C3B6A0] select-none"
                            onClick={() => props.onSelect(option.key)}
                        >
                            <FlagIcon code={option.key} className="w-3 h-3 rounded-full shrink-0" />
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {option.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
