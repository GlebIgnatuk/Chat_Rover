import { IShopProduct } from '@/store/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as R from 'ramda'

const LOCAL_STORAGE_KEY = '@shop/cart'

interface UseCartOptions {
    allProducts: IShopProduct[]
}

export type Cart = Record<string, { currency: 'XLNT' | 'RUB' }[]>

export const useCart = ({ ...props }: UseCartOptions) => {
    const isFirstRender = useRef(true)
    const [productIds, setProductIds] = useState<Cart>({})

    const productsIndexed = useMemo(
        () => R.indexBy(R.prop('_id'), props.allProducts),
        [props.allProducts],
    )

    const totalCount = useMemo(
        () => Object.values(productIds).reduce((acc, n) => acc + n.length, 0),
        [productIds],
    )
    const isEmpty = totalCount === 0

    const totalPrice = useMemo(() => {
        let total = 0

        for (const productId in productIds) {
            const product = productsIndexed[productId]!
            const items = productIds[productId]!

            for (const item of items) {
                if (item.currency === 'XLNT') continue

                const price = product.prices.find((p) => p.currency === item.currency)
                if (!price) return NaN

                total += price.price
            }
        }

        return total
    }, [productsIndexed, productIds])

    const addProduct = (id: string) => {
        setProductIds((prev) => {
            const copy = { ...prev }

            if (copy[id] === undefined) {
                copy[id] = []
            } else {
                copy[id] = [...copy[id]]
            }

            const product = productsIndexed[id]!
            const price = product.prices.find((p) => p.currency === 'RUB') ?? product.prices[0]!

            copy[id].push({ currency: price.currency })

            return copy
        })
    }

    const setPaymentMethodFor = (id: string, index: number, currency: 'XLNT' | 'RUB') => {
        setProductIds((prev) => {
            if (prev[id] === undefined || prev[id].length <= index) {
                return prev
            }

            const copy = { ...prev }
            copy[id] = [...copy[id]!]

            copy[id][index]!.currency = currency

            return copy
        })
    }

    const removeProduct = (id: string) => {
        setProductIds((prev) => {
            if (prev[id] === undefined) {
                return prev
            }

            const copy = { ...prev }
            copy[id] = [...copy[id]!]

            if (copy[id].length - 1 <= 0) {
                delete copy[id]
                return copy
            } else {
                copy[id].pop()
                return copy
            }
        })
    }

    const removeProductUnit = (id: string, index: number) => {
        setProductIds((prev) => {
            if (prev[id] === undefined || prev[id].length <= index) {
                return prev
            }

            const copy = { ...prev }
            copy[id] = [...copy[id]!]

            if (copy[id].length - 1 <= 0) {
                delete copy[id]
                return copy
            } else {
                copy[id].splice(index, 1)
                return copy
            }
        })
    }

    const reset = () => {
        setProductIds({})
    }

    useEffect(() => {
        try {
            const value = localStorage.getItem(LOCAL_STORAGE_KEY)
            const json = JSON.parse(value || '{}')

            if (typeof json !== 'object') {
                throw new Error()
            }

            const cart: Cart = {}
            for (const id in json) {
                if (productsIndexed[id] !== undefined && Array.isArray(json[id]) !== false) {
                    cart[id] = json[id]
                }
            }

            setProductIds(cart)
        } catch (e) {
            console.log('Invalid cart')
        }
    }, [productsIndexed])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        const json = JSON.stringify(productIds)
        localStorage.setItem(LOCAL_STORAGE_KEY, json)
    }, [productIds])

    return {
        addProduct,
        removeProduct,
        removeProductUnit,
        reset,
        isEmpty,
        totalCount: totalCount,
        setPaymentMethodFor,
        totalPrice,
        productsIndexed: productsIndexed,
        products: props.allProducts,
        items: productIds,
    }
}

export type UseCartReturn = ReturnType<typeof useCart>
