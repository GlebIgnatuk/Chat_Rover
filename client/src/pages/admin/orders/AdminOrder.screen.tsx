import { Card } from '@/components/Card'
import Checkbox from '@/components/Checkbox'
import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { buildImageUrl } from '@/config/path'
import { TelegramUserLink } from '@/features/accounts/components/TelegramUserLink'
import { Price } from '@/features/shop/components/Price'
import { useMutation } from '@/hooks/common/useMutation'
import { api } from '@/services/api'
import { IShopOrderAdmin, IShopOrderStatus, SHOP_ORDER_STATUSES } from '@/store/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const SubProduct = ({
    photoPath,
    name,
    item,
    onChangeStatus,
}: {
    photoPath: string
    name: string
    item: IShopOrderAdmin['products'][number]
    onChangeStatus: (processed: boolean) => void
}) => {
    return (
        <div className="grid grid-cols-[max-content,minmax(0,1fr),max-content] gap-4 py-2">
            <Checkbox checked={item.processed} onChange={onChangeStatus} />
            <img src={buildImageUrl(photoPath)} alt={name} className="w-8 h-8" />
            <Price currency={item.currency} value={item.price} />
        </div>
    )
}

const Product = ({
    product,
    items,
    onChangeStatus,
}: {
    product: IShopOrderAdmin['products'][number]
    items: IShopOrderAdmin['products']
    onChangeStatus: (subProductId: string, processed: boolean) => void
}) => {
    return (
        <Card className="p-1">
            <div className="grid grid-cols-[max-content,minmax(0,1fr)] items-center gap-2">
                <img
                    src={buildImageUrl(product.photoPath)}
                    alt={product.name}
                    className="w-16 h-16"
                />

                <div className="flex flex-col justify-start">
                    <div className="flex justify-between items-center">
                        <span className="text-primary-700 font-medium text-lg">{product.name}</span>
                        <span className="text-gray-200 text-sm">(x{items.length})</span>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-600 pl-[4.5rem]">
                {items.map((item, idx) => (
                    <SubProduct
                        key={idx}
                        item={item}
                        name={product.name}
                        photoPath={product.photoPath}
                        onChangeStatus={(processed) => onChangeStatus(item._id, processed)}
                    />
                ))}
            </div>
        </Card>
    )
}

const Order = ({ ...props }: { order: IShopOrderAdmin }) => {
    const [order, setOrder] = useState(props.order)

    const changeStatus = useMutation<IShopOrderAdmin, [string, IShopOrderStatus]>({
        fn: async (orderId, status) => {
            return api(`/admin/shopOrders/${orderId}/statuses`, {
                method: 'POST',
                body: JSON.stringify({ status }),
            })
        },
        onSuccess: (order) => {
            setOrder(order)
        },
    })

    const changeProductStatus = useMutation<IShopOrderAdmin, [string, string, boolean]>({
        fn: async (orderId, productId, processed) => {
            return api(`/admin/shopOrders/${orderId}/shopProducts/${productId}/statuses`, {
                method: 'POST',
                body: JSON.stringify({ status: processed ? 'processed' : 'pending' }),
            })
        },
        onSuccess: (order) => {
            setOrder(order)
        },
    })

    const grouped = order.products.reduce<Record<string, IShopOrderAdmin['products']>>((acc, n) => {
        if (acc[n.productId] === undefined) acc[n.productId] = []
        acc[n.productId]!.push(n)
        return acc
    }, {})

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr)]">
            <div className="bg-stone-800 py-3 px-2 flex items-center justify-between">
                <TelegramUserLink
                    nickname={order.user.nickname}
                    userId={order.user._id}
                    className="underline underline-offset-4 text-primary-700"
                />

                <select
                    onChange={(e) =>
                        changeStatus.send(order._id, e.target.value as IShopOrderStatus)
                    }
                    value={order.status}
                    className="bg-stone-800 text-primary-700 px-3 py-2 rounded-full"
                >
                    {SHOP_ORDER_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-y-auto p-1 space-y-2 py-2">
                {Object.keys(grouped).map((productId) => {
                    const products = grouped[productId]!
                    const product = products[0]!

                    return (
                        <Product
                            key={productId}
                            product={product}
                            items={products}
                            onChangeStatus={(subProductId, processed) =>
                                changeProductStatus.send(order._id, subProductId, processed)
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
}

export const AdminOrderScreen = () => {
    const { id: orderId } = useParams()

    const loadOrder = useMutation<IShopOrderAdmin>({
        fn: async () => {
            return api(`/admin/shopOrders/${orderId}`)
        },
    })

    useEffect(() => {
        loadOrder.send()
    }, [orderId])

    if (!loadOrder.data || loadOrder.isLoading) {
        return (
            <div className="flex items-center justify-center">
                <CircularLoaderIndicator size="xl" />
            </div>
        )
    } else if (loadOrder.error) {
        return (
            <div className="flex items-center justify-center text-red-500">{loadOrder.error}</div>
        )
    }

    return <Order order={loadOrder.data} />
}
