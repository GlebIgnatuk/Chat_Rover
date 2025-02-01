import { IShopProduct } from '@/store/types'
import { Cart } from '../hooks/useCart'
import { ProductCard } from './ProductCard'

interface Props {
    products: Record<string, IShopProduct[]>
    cartItems: Cart
    onAddProductToCart: (productId: string) => void
    onRemoveProductToCart: (productId: string) => void
}

export const MultiCategoryList = ({
    products,
    cartItems,
    onAddProductToCart,
    onRemoveProductToCart,
}: Props) => {
    return (
        <div className="pb-1 flex flex-col">
            {Object.keys(products).map((category) => (
                <div key={category}>
                    <div className="font-semibold text-2xl text-white bg-gradient-to-r from-primary-700/80 to-transparent px-1 py-1">
                        {category}
                    </div>

                    <div className="p-1 grid grid-cols-2 gap-1">
                        {products[category]!.map((p) => (
                            <ProductCard
                                key={p._id}
                                product={p}
                                onAddToCart={() => onAddProductToCart(p._id)}
                                onRemoveFromCart={() => onRemoveProductToCart(p._id)}
                                selectedCount={cartItems[p._id]?.length ?? 0}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
