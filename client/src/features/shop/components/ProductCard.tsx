import { buildImageUrl } from '@/config/path'
import { IShopProduct } from '@/store/types'
import { cn } from 'tailwind-cn'
import { Price } from './Price'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Fragment } from 'react/jsx-runtime'
import { useLocalize } from '@/hooks/intl/useLocalize'

interface Props {
    product: IShopProduct
    selectedCount: number
    onAddToCart: () => void
    onRemoveFromCart: () => void
}

export const ProductCard = ({ product, selectedCount, onAddToCart, onRemoveFromCart }: Props) => {
    const localize = useLocalize()

    return (
        <div
            className={cn('shadow-sm rounded-lg overflow-hidden bg-stone-800/80', {
                '': selectedCount !== 0,
            })}
        >
            <div className="relative">
                <img
                    src={buildImageUrl(product.photoPath)}
                    alt={product.name}
                    className="aspect-square object-contain object-center w-full pt-8 pb-3"
                />
                <div className="absolute left-1 top-1 font-semibold px-2 pb-2">{product.name}</div>
                {selectedCount !== 0 && (
                    <div className="absolute right-0 top-0 font-semibold w-8 h-8 bg-primary-700 text-stone-800 flex items-center justify-center rounded-bl-md">
                        {selectedCount}
                    </div>
                )}
            </div>

            <div className="px-1 bg-primary-700/50 text-white flex items-center justify-center h-6">
                {product.prices.map((p, idx) => (
                    <Fragment key={idx}>
                        <Price currency={p.currency} value={p.price} className="px-1" />
                        {idx !== product.prices.length - 1 && <div>/</div>}
                    </Fragment>
                ))}
            </div>

            <div
                className={cn('grid grid-cols-1 h-10', {
                    'grid-cols-2 divide-x divide-stone-800': selectedCount !== 0,
                })}
            >
                {selectedCount === 0 ? (
                    <button
                        key="add_to_cart"
                        className="w-full text-stone-800 bg-primary-700 py-2 px-3 font-medium flex items-center justify-center gap-3"
                        onClick={onAddToCart}
                    >
                        <FontAwesomeIcon icon={faCartPlus} className="w-5 h-5" />
                        <span className="font-semibold leading-none">
                            {localize('shop__add_to_cart')}
                        </span>
                    </button>
                ) : (
                    <>
                        <button
                            key="add"
                            className="w-full text-stone-800 bg-primary-700 py-2 px-3 font-medium flex items-center justify-center gap-3 active:bg-primary-700/50 transition-colors"
                            onClick={onRemoveFromCart}
                        >
                            <FontAwesomeIcon icon={faMinus} className="w-5 h-5" />
                        </button>

                        <button
                            key="remove"
                            className="w-full text-stone-800 bg-primary-700 py-2 px-3 font-medium flex items-center justify-center gap-3 active:bg-primary-700/50 transition-colors"
                            onClick={onAddToCart}
                        >
                            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
