import { buildAppPath, buildImageUrl } from '@/config/path'
import { useStore } from '@/context/app/useStore'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { IShopProduct } from '@/store/types'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

export const ShopScreen = () => {
    const games = useStore((state) => state.games.items)
    const products = useStore((state) => state.products.items)

    const localize = useLocalize()

    const productsByGame = useMemo(() => {
        return Object.values(products).reduce<Record<string, IShopProduct[]>>((acc, n) => {
            const key = n.gameId || 'other'
            if (acc[key] === undefined) acc[key] = []
            acc[key].push(n)
            return acc
        }, {})
    }, [products])

    return (
        <div className="grid grid-cols-1 auto-rows-max overflow-y-auto gap-2 py-2">
            <div className="font-semibold text-2xl text-white bg-gradient-to-r from-primary-700/80 to-transparent px-1 py-1">
                {localize('shop__by_game')}
            </div>

            {Object.values(games).map((game) => (
                <NavLink
                    key={game._id}
                    to={buildAppPath(`/shop/${game.slug}`)}
                    className="flex gap-2 bg-stone-800/50 rounded-lg mx-1"
                >
                    <img
                        src={buildImageUrl(game.photoPath)}
                        alt={game.name}
                        className="aspect-square object-cover object-center w-20 rounded-lg"
                    />

                    <div className="pt-2">
                        <div className="text-primary-700 font-semibold">{game.name}</div>
                        <div className="text-white lowercase">
                            {productsByGame[game._id]?.length ?? 0} {localize('shop__products')}
                        </div>
                    </div>
                </NavLink>
            ))}
        </div>
    )
}
