import { useStore } from '@/context/app/useStore'
import { FloatingCartButton } from '@/features/shop/components/FloatingCartButton'
import { MultiCategoryList } from '@/features/shop/components/MultiCategoryList'
import { OrderModal } from '@/features/shop/components/OrderModal'
import { SingleCategoryList } from '@/features/shop/components/SingleCategoryList'
import { SuccessOrderModal } from '@/features/shop/components/SuccessOrderModal'
import { useCart } from '@/features/shop/hooks/useCart'
import { useMutation } from '@/hooks/common/useMutation'
import { IShopProduct } from '@/store/types'
import { useEffect, useState } from 'react'
import { cn } from 'tailwind-cn'

export const ShopScreen = () => {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isSuccessOrderMessageShown, setIsSuccessOrderMessageShown] = useState(false)
    const [products, setProducts] = useState<IShopProduct[]>([
        {
            _id: '1',
            name: 'Lunite subscription',
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
            _id: '2.2',
            name: 'Lunite x100',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [{ currency: 'XLNT', discount: 0, discountEndsAt: null, price: 100 }],
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
            name: 'Lunite x980',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 1290 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 980 },
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
            name: 'Lunite x6480',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', discount: 0, discountEndsAt: null, price: 8990 },
                { currency: 'XLNT', discount: 0, discountEndsAt: null, price: 6480 },
            ],
            mode: 'request',
        },
    ])
    void setProducts
    const [category, setCategory] = useState<string | null>(null)

    const user = useStore((state) => state.identity.user)
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

    const cart = useCart({ allProducts: products, userBalance: user.balance })

    const createOrder = useMutation<null>({
        fn: async () => {
            await new Promise((res) => setTimeout(res, 3000))

            return { success: true, data: null, error: null }
        },
        onSuccess: () => {
            cart.reset()
            setIsCartOpen(false)
            setIsSuccessOrderMessageShown(true)
        },
    })

    useEffect(() => {
        if (cart.isEmpty) {
            setIsCartOpen(false)
        }
    }, [cart.isEmpty])

    return (
        <div className="relative h-full grid grid-rows-[max-content,minmax(0,1fr)]">
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

            <div className="relative">
                <div className="h-full overflow-y-auto pb-20">
                    {category ? (
                        <SingleCategoryList
                            products={grouped[category]!}
                            onAddProductToCart={cart.addProduct}
                            onRemoveProductToCart={cart.removeProduct}
                            cartItems={cart.items}
                        />
                    ) : (
                        <MultiCategoryList
                            products={grouped}
                            onAddProductToCart={cart.addProduct}
                            onRemoveProductToCart={cart.removeProduct}
                            cartItems={cart.items}
                        />
                    )}
                </div>

                {!cart.isEmpty && <FloatingCartButton onClick={() => setIsCartOpen(true)} />}
            </div>

            <SuccessOrderModal
                open={isSuccessOrderMessageShown}
                onContinue={() => setIsSuccessOrderMessageShown(false)}
                onShowOrder={() => {}}
            />

            <OrderModal
                open={isCartOpen}
                loading={createOrder.isLoading}
                cart={cart}
                onClose={() => setIsCartOpen(false)}
                onCancel={() => {
                    cart.reset()
                    setIsCartOpen(false)
                }}
                onConfirm={createOrder.send}
            />
        </div>
    )
}
