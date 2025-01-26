import { buildImageUrl } from '@/config/path'
import { IShopProduct } from '@/store/types'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { cn } from 'tailwind-cn'

const Currency = ({ currency }: { currency: 'XLNT' | 'RUB' }) => {
    if (currency === 'XLNT') {
        return (
            <img src={buildImageUrl('/currency/lunite.png')} alt={currency} className="w-6 h-6" />
        )
    } else {
        return <span className="uppercase text-sm font-medium">{currency}</span>
    }
}

const ProductCard = ({ product }: { product: IShopProduct }) => {
    return (
        <div className="shadow-sm rounded-lg overflow-hidden bg-stone-800/80">
            <div className="relative">
                <img
                    src={buildImageUrl(product.photoPath)}
                    alt={product.name}
                    className="aspect-square object-contain object-center w-full pt-8 pb-3"
                />
                <div className="absolute left-1 top-1 font-semibold px-2 pb-2">{product.name}</div>
            </div>

            <div className="px-1 bg-primary-700/50 text-white flex items-center justify-center h-6">
                {product.prices.map((p, idx) => (
                    <>
                        <div className="flex gap-1 items-center px-1">
                            <Currency currency={p.currency} />
                            <span className="text-sm">{p.price}</span>
                        </div>
                        {idx !== product.prices.length - 1 && <div>/</div>}
                    </>
                ))}
            </div>

            <div className="grid grid-cols-[minmax(0,1fr),max-content] divide-x divide-primary-700">
                <button className="text-center text-stone-800 bg-primary-700 py-2 font-medium">
                    Buy now
                </button>
                <button className="text-center text-primary-700 bg-stone-800 pt-1 px-3 font-medium">
                    <FontAwesomeIcon icon={faCartPlus} className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

const MultiCategoryList = ({ products }: { products: Record<string, IShopProduct[]> }) => {
    return (
        <div className="pb-1 flex flex-col">
            {Object.keys(products).map((category) => (
                <div key={category}>
                    <div className="font-semibold text-2xl text-white bg-gradient-to-r from-primary-700/80 to-transparent px-1 py-1">
                        {category}
                    </div>

                    <div className="p-1 grid grid-cols-2 gap-1">
                        {products[category]!.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

const SingleCategoryList = ({ products }: { products: IShopProduct[] }) => {
    return (
        <div className="p-1 grid grid-cols-2 gap-1">
            {products.map((p) => (
                <ProductCard key={p._id} product={p} />
            ))}
        </div>
    )
}

export const ShopScreen = () => {
    const [products, setProducts] = useState<IShopProduct[]>([
        {
            _id: '1',
            name: "Traveler' Tube Aid",
            photoPath: '/products/lunite_subscription.png',
            category: 'Bundles',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 449 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 300 },
            ],
            mode: 'request',
        },
        {
            _id: '2',
            name: 'Lunite x60',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 99 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 60 },
            ],
            mode: 'request',
        },
        {
            _id: '3',
            name: 'Lunite x300',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 449 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 300 },
            ],
            mode: 'request',
        },
        {
            _id: '4',
            name: 'Lunite x3280',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 4490 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 3280 },
            ],
            mode: 'request',
        },
        {
            _id: '5',
            name: 'Lunite x3280',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 4490 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 3280 },
            ],
            mode: 'request',
        },
        {
            _id: '6',
            name: 'Lunite x3280',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 4490 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 3280 },
            ],
            mode: 'request',
        },
    ])
    void setProducts
    const [category, setCategory] = useState<string | null>(null)

    const grouped = products.reduce<Record<string, IShopProduct[]>>((acc, n) => {
        if (!acc[n.category]) acc[n.category] = []
        acc[n.category]!.push(n)
        return acc
    }, {})
    const categories = [
        { key: null, label: 'All' },
        ...Object.keys(grouped)
            .sort()
            .map((c) => ({ key: c, label: c })),
    ]

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr)]">
            <div className="grid grid-cols-[max-content,minmax(0,1fr)] bg-stone-800">
                <button className="w-12 bg-stone-800 text-primary-700 text-lg">( ? )</button>

                <div className="space-x-2 whitespace-nowrap overflow-x-scroll overflow-y-hidden w-full px-1 py-1 scrollbar-none ">
                    {categories.map((c) => (
                        <button
                            key={c.key}
                            onClick={() => setCategory(c.key)}
                            className={cn('text-lg px-4 py-1 rounded-full', {
                                'text-primary-700': category === c.key,
                            })}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto">
                {category ? (
                    <SingleCategoryList products={grouped[category]!} />
                ) : (
                    <MultiCategoryList products={grouped} />
                )}
            </div>
        </div>
    )
}
