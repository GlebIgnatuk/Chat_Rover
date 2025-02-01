import { buildImageUrl } from '@/config/path'
import { faTrashAlt, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import { UseCartReturn } from '../hooks/useCart'
import { Price } from './Price'
import { cn } from 'tailwind-cn'

interface Props {
    open: boolean
    loading: boolean
    cart: UseCartReturn
    onClose: () => void
    onCancel: () => void
    onConfirm: () => void
}

export const OrderModal = ({ open, cart, loading, onClose, onCancel, onConfirm }: Props) => {
    return (
        <Modal open={open}>
            <div className="bg-stone-800/90 h-full p-2 grid grid-rows-[max-content,max-content,minmax(0,1fr),max-content]">
                <div className="flex justify-between items-center">
                    <div className="text-xl text-primary-700">Order</div>
                    <button className="bg-primary-700 w-6 h-6 rounded" onClick={onClose}>
                        <FontAwesomeIcon icon={faX} className="text-stone-800 w-4 h-4" />
                    </button>
                </div>

                <div className="text-gray-300 mt-3 border-b-2 border-primary-700 pb-2">
                    Please confirm and submit your order
                </div>

                <div className="divide-y divide-primary-700/50 overflow-y-auto pt-2">
                    {Object.keys(cart.items).map((productId) => {
                        const product = cart.productsIndexed[productId]!
                        const items = cart.items[productId]!

                        return (
                            <div key={productId} className="pt-2">
                                <div className="grid grid-cols-[max-content,minmax(0,1fr)] gap-2">
                                    <img
                                        src={buildImageUrl(product.photoPath)}
                                        alt={product.name}
                                        className="w-16 h-16"
                                    />

                                    <div className="flex flex-col justify-start">
                                        <div className="flex justify-between items-center">
                                            <span className="text-primary-700 font-medium text-lg">
                                                {product.name}
                                            </span>
                                            <span className="text-gray-200 text-sm">
                                                (x{items.length})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-white">
                                            {product.prices.map((p, idx) => (
                                                <>
                                                    <div className="flex gap-1 items-center px-1">
                                                        <Price
                                                            currency={p.currency}
                                                            value={
                                                                items.filter(
                                                                    (item) =>
                                                                        item.currency ===
                                                                        p.currency,
                                                                ).length * p.price
                                                            }
                                                        />
                                                    </div>
                                                    {idx !== product.prices.length - 1 && (
                                                        <div>/</div>
                                                    )}
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-600 pl-14">
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-[max-content,minmax(0,1fr),max-content] gap-4 py-2"
                                        >
                                            <img
                                                src={buildImageUrl(product.photoPath)}
                                                alt={product.name}
                                                className="w-8 h-8"
                                            />

                                            <div className="flex items-center gap-2">
                                                {product.prices.map((price) => (
                                                    <button
                                                        key={price.currency}
                                                        className={cn(
                                                            'flex items-center justify-center gap-1 border border-primary-700 rounded-full px-4 py-1 text-white',
                                                            {
                                                                'bg-primary-700 text-stone-800 border-transparent':
                                                                    price.currency ===
                                                                    item.currency,
                                                            },
                                                        )}
                                                        onClick={() =>
                                                            cart.setPaymentMethodFor(
                                                                productId,
                                                                idx,
                                                                price.currency,
                                                            )
                                                        }
                                                    >
                                                        <Price
                                                            currency={price.currency}
                                                            value={price.price}
                                                        />
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() =>
                                                    cart.removeProductUnit(productId, idx)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                    className="w-4 h-4 text-red-700"
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="border-t-2 border-primary-700 pt-3">
                    <div className="flex justify-between items-end">
                        <div className="text-3xl text-white font-semibold">Total:</div>
                        <div className="text-white text-xl">
                            {cart.totalPrice === 0 ? (
                                'FREE'
                            ) : (
                                <Price currency="RUB" value={cart.totalPrice} />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-[max-content,minmax(0,1fr)] mt-2 py-2 gap-2">
                        <button
                            disabled={loading}
                            className="bg-red-700 text-white rounded-full py-1 px-6 disabled:bg-gray-500"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            className="bg-primary-700 text-stone-800 rounded-full py-2 font-semibold disabled:bg-gray-500"
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
