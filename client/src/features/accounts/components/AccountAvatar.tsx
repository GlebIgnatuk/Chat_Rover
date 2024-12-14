import { cn } from 'tailwind-cn'

export interface AccountAvatarProps {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    url?: string | null
    nickname?: string
    bordered?: boolean
    radius?: 'xl' | 'full'
}

export const AccountAvatar = ({ size, bordered, radius, url, nickname }: AccountAvatarProps) => {
    return (
        <div
            className={cn(
                'flex items-center justify-center text-primary-700 bg-gradient-to-b from-stone-800 to-stone-700 uppercase font-semibold overflow-hidden',
                {
                    'w-20 h-20 text-3xl': size === '3xl',
                    'w-[4.5rem] h-[4.5rem] text-2xl': size === '2xl',
                    'w-16 h-16 text-xl': size === 'xl',
                    'w-14 h-14 text-lg': size === 'lg',
                    'w-12 h-12 text-md': size === 'md',
                    'w-8 h-8 text-sm': size === 'sm',
                    'w-6 h-6 text-xs': size === 'xs',
                    'border-primary-700 border': bordered !== false,
                    'rounded-xl': radius === 'xl',
                    'rounded-full': radius === undefined || radius === 'full',
                },
            )}
        >
            {url ? (
                <img src={url} className="w-full h-full object-cover object-center" />
            ) : nickname ? (
                <span>{nickname.substring(0, 2)}</span>
            ) : null}
        </div>
    )
}
