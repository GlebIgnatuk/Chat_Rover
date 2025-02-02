import { useStore } from '@/context/app/useStore'
import { IIdentity } from '@/context/auth/AuthContext'
import { FloatingCartButton } from '@/features/shop/components/FloatingCartButton'
import { MultiCategoryList } from '@/features/shop/components/MultiCategoryList'
import { OrderModal } from '@/features/shop/components/OrderModal'
import { SingleCategoryList } from '@/features/shop/components/SingleCategoryList'
import { SuccessOrderModal } from '@/features/shop/components/SuccessOrderModal'
import { useCart } from '@/features/shop/hooks/useCart'
import { useMutation } from '@/hooks/common/useMutation'
import { api } from '@/services/api'
import { IShopOrder, IShopProduct } from '@/store/types'
import { useEffect, useMemo, useState } from 'react'
import { cn } from 'tailwind-cn'

export const ShopScreen = () => {
    const productsIndexed = useStore((state) => state.products.items)
    const products = useMemo(() => Object.values(productsIndexed), [productsIndexed])

    const [isCartOpen, setIsCartOpen] = useState(false)
    const [completedOrder, setCompletedOrder] = useState<IShopOrder | null>(null)
    const [category, setCategory] = useState<string | null>(null)

    const { user, setUser } = useStore((state) => state.identity)
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

    const cart = useCart({ products: productsIndexed, userBalance: user.balance })

    const refreshUser = useMutation<IIdentity>({
        fn: async () => {
            return api('/users/me')
        },
        onSuccess: (identity) => {
            setUser(identity.user)
        },
    })

    const createOrder = useMutation<IShopOrder>({
        fn: async () => {
            const body = Object.keys(cart.items)
                .map((key) => {
                    const items = cart.items[key]!.map((item) => ({
                        productId: key,
                        currency: item.currency,
                    }))

                    return items
                })
                .flat()

            return api('/shopOrders', {
                method: 'POST',
                body: JSON.stringify(body),
            })
        },
        onSuccess: (order) => {
            cart.reset()
            setIsCartOpen(false)
            refreshUser.send()
            setCompletedOrder(order)
        },
        errorTimerMs: 3000,
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
                open={completedOrder !== null}
                onContinue={() => setCompletedOrder(null)}
                onShowOrder={() => {}}
            />

            <OrderModal
                open={isCartOpen}
                loading={createOrder.isLoading}
                error={createOrder.error}
                cart={cart}
                products={productsIndexed}
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
