import { buildUrl } from '@/utils/url'
import { faAnchor, faBaby, faHome, faQuestion, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useLocation } from 'react-router-dom'
import { cn } from 'tailwind-cn'

interface NavigationItemProps {
    label: string
    icon: IconDefinition
    href: string
    disabled?: boolean
}

const NavigationItem = ({ href, icon, label, disabled }: NavigationItemProps) => {
    const location = useLocation()
    const active = location.pathname === href

    return (
        <Link
            to={href}
            className={cn('grow basis-0 shrink-0 flex flex-col justify-between items-center py-1', {
                'bg-gradient-to-b from-amber-800 to-transparent': active,
                'pointer-events-none': disabled,
            })}
        >
            <FontAwesomeIcon
                icon={icon}
                className={cn('w-6 h-6', {
                    'text-slate-500': disabled,
                    'text-primary-100': !disabled,
                })}
            />
            <span
                className={cn('leading-none text-sm text-primary-100 select-none', {
                    'font-medium': active,
                    'text-slate-500': disabled,
                    'text-primary-100': !disabled,
                })}
            >
                {label}
            </span>
        </Link>
    )
}

export const Navigation = () => {
    return (
        <nav className="flex border-t-[2px] border-amber-800 bg-amber-950/50">
            <NavigationItem icon={faQuestion} label="quest" href={buildUrl('/quest')} disabled />
            <NavigationItem icon={faBaby} label="Baby" href={buildUrl('/baby')} disabled />
            <NavigationItem icon={faHome} label="Home" href={buildUrl('/')} />
            <NavigationItem icon={faAnchor} label="Convene" href={buildUrl('/convene')} disabled />
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
        </nav>
    )
}
