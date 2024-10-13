import { ReactNode } from 'react'
import { cn } from 'tailwind-cn'

interface Props {
    children: ReactNode
    className?: string
}

export const Icon = (props: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="flag-icons-us"
            viewBox="0 0 512 512"
            className={cn('w-4 h-4', props.className)}
        >
            {props.children}
        </svg>
    )
}
