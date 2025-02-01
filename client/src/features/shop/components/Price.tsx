import { cn } from 'tailwind-cn'
import { Currency } from './Currency'

interface Props {
    value: number
    currency: 'XLNT' | 'RUB'
    className?: string
}

export const Price = ({ currency, value, className }: Props) => {
    return (
        <div className={cn('flex gap-1 items-center', className)}>
            <Currency currency={currency} />
            <span>{value}</span>
        </div>
    )
}
