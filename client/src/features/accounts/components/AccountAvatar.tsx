import { ReactNode } from 'react'
import { cn } from 'tailwind-cn'

export interface AccountAvatarProps {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    url?: string | null
    nickname?: string
    bordered?: boolean
    radius?: 'xl' | 'full'
    online?: boolean
    children?: ReactNode
}

export const AccountAvatar = ({
    size,
    bordered,
    radius,
    url,
    nickname,
    online,
    children,
}: AccountAvatarProps) => {
    return (
        <div
            className={cn(
                'relative flex items-center justify-center text-primary-700 bg-gradient-to-b from-stone-800 to-stone-700 uppercase font-semibold',
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
                <img
                    src={url}
                    className={cn('w-full h-full object-cover object-center', {
                        'rounded-xl': radius === 'xl',
                        'rounded-full': radius === undefined || radius === 'full',
                    })}
                />
            ) : nickname ? (
                <span>{nickname.substring(0, 2)}</span>
            ) : children ? (
                children
            ) : null}

            <div
                className={cn('absolute w-3 h-3 border border-primary-700 rounded-full', {
                    hidden: online === undefined,
                    'bg-[#7CFC00]': online === true,
                    'bg-stone-200': online === false,
                    'w-4 h-4 bottom-[3px] right-[3px]': size === '3xl',
                    'w-4 h-4 bottom-[2.5px] right-[2.5px]': size === '2xl',
                    'w-3 h-3 bottom-[3px] right-[3px]': size === 'xl',
                    'w-3 h-3 bottom-[2px] right-[2px]': size === 'lg',
                    'w-3 h-3 bottom-[1px] right-[1px]': size === 'md',
                    'w-2 h-2 bottom-0 right-0': size === 'sm',
                    'w-2 h-2 -bottom-[1px] -right-[1px]': size === 'xs',
                })}
            ></div>
        </div>
    )
}
