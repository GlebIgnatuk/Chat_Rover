import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cn } from 'tailwind-cn'

export interface CircularLoaderIndicatorProps {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export const CircularLoaderIndicator = ({ size, className }: CircularLoaderIndicatorProps) => {
    return (
        <FontAwesomeIcon
            icon={faCircleNotch}
            className={cn(
                'w-4 h-4 animate-spin duration-1000',
                {
                    'w-20 h-20': size === 'xl',
                    'w-16 h-16': size === 'lg',
                    'w-12 h-12': size === 'md',
                    'w-8 h-8': size === 'sm',
                    'w-4 h-4': size === 'xs',
                },
                className,
            )}
        />
    )
}
