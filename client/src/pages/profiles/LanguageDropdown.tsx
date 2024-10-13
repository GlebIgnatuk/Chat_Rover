import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDropdown } from './useDropdown'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { cn } from 'tailwind-cn'

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
                        'h-auto max-h-24': dropdown.isOpen,
                    },
                )}
            >
                <div className="overflow-y-auto">
                    {dropdown.options.map((option) => (
                        <div
                            key={option.key}
                            className="text-white px-2 py-1 whitespace-nowrap hover:bg-[#C3B6A0] select-none"
                            onClick={() => props.onSelect(option.key)}
                        >
                            {option.value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
