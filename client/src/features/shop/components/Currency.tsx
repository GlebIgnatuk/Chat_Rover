import { buildImageUrl } from '@/config/path'
import { ICurrency } from '@/store/types'

export const Currency = ({ currency }: { currency: ICurrency }) => {
    if (currency === 'XLNT') {
        return (
            <img src={buildImageUrl('/currency/lunite.png')} alt={currency} className="w-6 h-6" />
        )
    } else {
        return <span className="uppercase text-sm font-medium">{currency}</span>
    }
}
