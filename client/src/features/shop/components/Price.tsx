import { cn } from 'tailwind-cn'
import { Currency } from './Currency'
import { ICurrency } from '@/store/types'

interface Props {
    value: number
    currency: ICurrency
    className?: string
}

export const Price = ({ currency, value, className }: Props) => {
    return (
        <div className={cn('flex gap-1 items-center', className)}>
            <Currency currency={currency} />
            <span>{value.toLocaleString()}</span>
        </div>
    )
}
