import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { cn } from 'tailwind-cn'
import { buildAppPath } from '@/config/path'
import { InstructionsModal } from '@/features/shop/components/InstructionsModal'
import { useLocalize } from '@/hooks/intl/useLocalize'

export const ShopLayout = () => {
    const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false)

    const localize = useLocalize()

    return (
        <div className="relative h-full grid grid-rows-[max-content,minmax(0,1fr)]">
            <div className="grid grid-cols-[max-content,1fr,1fr] border-b border-primary-700 bg-stone-800/90">
                <button
                    className="px-4 py-2 text-center font-semibold"
                    onClick={() => setIsInstructionsModalOpen(true)}
                >
                    {localize('general__help')}
                </button>
                <NavLink
                    className={({ isActive }) =>
                        cn('px-2 py-2 text-center font-semibold', {
                            'bg-primary-700 text-stone-800': isActive,
                        })
                    }
                    to={buildAppPath('/shop')}
                    end
                >
                    {localize('nav__shop')}
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        cn('px-2 py-2 text-center font-semibold', {
                            'bg-primary-700 text-stone-800': isActive,
                        })
                    }
                    to={buildAppPath('/shop/orders')}
                >
                    {localize('shop__my_orders')}
                </NavLink>
            </div>

            <Outlet />

            <InstructionsModal
                open={isInstructionsModalOpen}
                onClose={() => setIsInstructionsModalOpen(false)}
            />
        </div>
    )
}
