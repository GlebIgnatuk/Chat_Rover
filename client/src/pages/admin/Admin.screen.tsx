import { buildAdminPath } from '@/config/path'
import { NavLink } from 'react-router-dom'
import { cn } from 'tailwind-cn'

const links = [
    { path: buildAdminPath('giveaways'), label: 'Розыгрыши', disabled: false },
    { path: buildAdminPath('orders'), label: 'Заказы', disabled: false },
    //
].concat(
    Array.from({ length: 13 }, (_, idx) => ({
        path: '/' + idx,
        label: '',
        disabled: true,
    })),
)

export const AdminScreen = () => {
    return (
        <div className="h-full overflow-y-auto grid grid-cols-2 gap-2 auto-rows-[100px] p-2">
            {links.map((link) => (
                <NavLink
                    to={link.path}
                    key={link.path}
                    onClick={(e) => {
                        if (link.disabled) e.preventDefault()
                    }}
                    className={cn(
                        'bg-stone-800 text-primary-700 flex items-center justify-center font-semibold rounded-lg border border-primary-700',
                        {
                            'border-gray-200 bg-stone-700 cursor-not-allowed': link.disabled,
                        },
                    )}
                >
                    {link.label}
                </NavLink>
            ))}
        </div>
    )
}
