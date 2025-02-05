import { Card } from '@/components/Card'
import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { buildImageUrl } from '@/config/path'
import { Price } from '@/features/shop/components/Price'
import { useMutation } from '@/hooks/common/useMutation'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { api } from '@/services/api'
import { IShopOrder, IShopOrderAdmin } from '@/store/types'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from 'tailwind-cn'

const SubProduct = ({
    photoPath,
    name,
    item,
}: {
    photoPath: string
    name: string
    item: IShopOrderAdmin['products'][number]
}) => {
    const localize = useLocalize()
    const status = item.processed ? 'processed' : 'pending'

    return (
        <div className="grid grid-cols-[max-content,minmax(0,1fr),max-content] gap-4 py-2">
            <img src={buildImageUrl(photoPath)} alt={name} className="w-8 h-8" />
            <div>
                <span
                    className={cn('text-white px-2 py-1 lowercase rounded-full', {
                        'bg-amber-600': status === 'pending',
                        'bg-green-700': status === 'processed',
                    })}
                >
                    {localize(`shop__order__${status}`)}
                </span>
            </div>
            <Price currency={item.currency} value={item.price} />
        </div>
    )
}

const Product = ({
    product,
    items,
}: {
    product: IShopOrderAdmin['products'][number]
    items: IShopOrderAdmin['products']
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
                    />
                ))}
            </div>
        </Card>
    )
}

const Order = ({ order }: { order: IShopOrder }) => {
    const grouped = order.products.reduce<Record<string, IShopOrderAdmin['products']>>((acc, n) => {
        if (acc[n.productId] === undefined) acc[n.productId] = []
        acc[n.productId]!.push(n)
        return acc
    }, {})

    return (
        <div className="h-full overflow-y-auto p-1 space-y-2 py-2">
            {Object.keys(grouped).map((productId) => {
                const products = grouped[productId]!
                const product = products[0]!

                return <Product key={productId} product={product} items={products} />
            })}
        </div>
    )
}

export const OrderScreen = () => {
    const { id: orderId } = useParams()

    const loadOrder = useMutation<IShopOrder>({
        fn: async () => {
            return api(`/shopOrders/${orderId}`)
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
