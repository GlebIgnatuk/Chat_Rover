import { ComponentProps } from 'react'
import { cn } from 'tailwind-cn'

export interface CardProps extends ComponentProps<'div'> {}

export const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div {...props} className={cn('bg-black/30 backdrop-blur-sm rounded-xl', className)}>
            {children}
        </div>
    )
}
