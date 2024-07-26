import { buildUrl } from '@/utils/url'
import { faAnchor, faBaby, faQuestion, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons'
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
            className={cn(
                'flex flex-col items-center justify-center rounded-full bg-black/30 backdrop-blur-sm aspect-square',
                {
                    'pointer-events-none': disabled,
                },
            )}
        >
            <FontAwesomeIcon
                icon={icon}
                className={cn('w-5 h-5', {
                    'text-slate-300': disabled,
                    'text-white': !disabled,
                })}
            />
            <span
                className={cn('leading-none text-xs select-none', {
                    'font-medium': active,
                    'text-slate-300': disabled,
                    'text-white': !disabled,
                })}
            >
                {label}
            </span>
        </Link>
    )
}

export const RightNavigation = () => {
    return (
        <nav className="absolute z-0 top-0 right-1 w-14 space-y-1 mt-10">
            <NavigationItem icon={faQuestion} label="quest" href={buildUrl('/quest')} disabled />
            <NavigationItem icon={faBaby} label="Baby" href={buildUrl('/baby')} disabled />
            <NavigationItem icon={faAnchor} label="Convene" href={buildUrl('/convene')} disabled />
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
        </nav>
    )
}

export const LeftNavigation = () => {
    return (
        <nav className="absolute z-0 top-0 left-1 w-14 space-y-1 mt-10">
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
            <NavigationItem icon={faUser} label="Account" href={buildUrl('/account')} />
        </nav>
    )
}
