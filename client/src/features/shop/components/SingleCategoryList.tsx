import { IShopProduct } from '@/store/types'
import { Cart } from '../hooks/useCart'
import { ProductCard } from './ProductCard'

interface Props {
    products: IShopProduct[]
    cartItems: Cart
    onAddProductToCart: (productId: string) => void
    onRemoveProductToCart: (productId: string) => void
}

export const SingleCategoryList = ({
    products,
    cartItems,
    onAddProductToCart,
    onRemoveProductToCart,
}: Props) => {
    return (
        <div className="p-1 grid grid-cols-2 gap-1">
            {products.map((p) => (
                <ProductCard
                    key={p._id}
                    product={p}
                    onAddToCart={() => onAddProductToCart(p._id)}
                    onRemoveFromCart={() => onRemoveProductToCart(p._id)}
                    selectedCount={cartItems[p._id]?.length ?? 0}
                />
            ))}
        </div>
    )
}
