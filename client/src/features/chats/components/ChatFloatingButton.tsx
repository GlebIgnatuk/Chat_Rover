import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cn } from 'tailwind-cn'

interface Props {
    className?: string
    icon: IconProp
    onClick: () => void
}

export const ChatFloatingButton = ({ onClick, className, icon }: Props) => {
    return (
        <div
            className={cn(
                'w-12 h-12 p-3 rounded-full flex items-center justify-center bg-stone-800 text-primary-700 cursor-pointer',
                className,
            )}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} className="w-full h-full" />
        </div>
    )
}
