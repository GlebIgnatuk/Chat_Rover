import { IShopProduct } from '@/store/types'
import { useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = '@shop/cart'

export const useCart = () => {
    const [productIds, setProductIds] = useState<Record<string, number>>({})

    const allProducts: Record<string, IShopProduct> = {}

    const addProduct = (id: string) => {
        setProductIds((prev) => {
            if (prev[id] === undefined) {
                prev[id] = 0
            }

            return { ...prev, [id]: prev[id] + 1 }
        })
    }

    const removeProduct = (id: string) => {
        setProductIds((prev) => {
            if (prev[id] === undefined) {
                return prev
            }

            if (prev[id] === 0) {
                const copy = { ...prev }
                delete copy[id]
                return copy
            } else {
                return { ...prev, [id]: prev[id] - 1 }
            }
        })
    }

    useEffect(() => {
        try {
            const value = localStorage.getItem(LOCAL_STORAGE_KEY)
            const json = JSON.parse(value || '[]')
            setProductIds(json)
        } catch (e) {
            console.log('Invalid cart')
        }
    }, [])

    useEffect(() => {
        const json = JSON.stringify(productIds)
        localStorage.setItem(LOCAL_STORAGE_KEY, json)
    }, [productIds])

    return {
        addProduct,
        removeProduct,
        allProducts: allProducts,
        selectedProducts: productIds,
    }
}
