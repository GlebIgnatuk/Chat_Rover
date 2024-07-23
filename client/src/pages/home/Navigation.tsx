import { faAnchor, faBaby, faHome, faQuestion, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useLocation } from 'react-router-dom'
import { cn } from 'tailwind-cn'

interface NavigationItemProps {
  label: string
  icon: IconDefinition
  href: string
}

const NavigationItem = ({ href, icon, label }: NavigationItemProps) => {
  const location = useLocation()
  const active = location.pathname === href

  return (
    <Link to={href} className="grow basis-0 shrink-0 flex flex-col justify-between items-center gap-1 p-2">
      <FontAwesomeIcon
        icon={icon}
        className={cn('w-6 h-6', {
          'text-primary-700': active,
          'text-primary-100': !active,
        })}
      />
      <span
        className={cn('leading-none text-sm', {
          'text-primary-700 font-medium': active,
          'text-primary-100': !active,
        })}
      >
        {label}
      </span>
    </Link>
  )
}

export const Navigation = () => {
  return (
    <nav className="flex divide-x-[1px] border-t-[1px] bg-gray-700/45">
      <NavigationItem icon={faQuestion} label="quest" href="/quest" />
      <NavigationItem icon={faBaby} label="Baby" href="/baby" />
      <NavigationItem icon={faHome} label="Home" href="/" />
      <NavigationItem icon={faAnchor} label="Convene" href="/convene" />
      <NavigationItem icon={faUser} label="Account" href="/account" />
    </nav>
  )
}
