import { cn } from 'tailwind-cn'

export interface CharacterAvatarProps {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    level?: number
    url?: string | null
    bordered?: boolean
}

export const CharacterAvatar = ({ size, bordered, url, level }: CharacterAvatarProps) => {
    return (
        <div
            className={cn(
                'relative flex items-center justify-center rounded-full text-primary-700 bg-gradient-to-b from-stone-800 to-stone-700 uppercase font-semibold',
                {
                    'w-16 h-16 text-xl': size === 'xl',
                    'w-14 h-14 text-lg': size === 'lg',
                    'w-12 h-12 text-md': size === 'md',
                    'w-8 h-8 text-sm': size === 'sm',
                    'w-6 h-6 text-xs': size === 'xs',
                    'border-primary-700 border': bordered !== false,
                },
            )}
        >
            <img
                src={url ?? undefined}
                className={cn('w-full h-full object-cover object-top rounded-full')}
            />

            {level !== undefined && (
                <div
                    className={cn(
                        'absolute flex items-center justify-center bg-stone-800 rounded-full border border-primary-700',
                        {
                            'w-6 h-6 -top-[2px] -right-[2px] text-sm font-medium': size === 'xl',
                            'w-5 h-5 -top-[2px] -right-[2px] text-xs font-medium': size === 'lg',
                            'w-5 h-5 -top-[3px] -right-[3px] text-xs font-medium': size === 'md',
                            'w-4 h-4 -top-[4px] -right-[4px] text-[10px] font-medium':
                                size === 'sm',
                            'w-3 h-3 -top-[3px] -right-[3px] text-[8px] font-medium': size === 'xs',
                        },
                    )}
                >
                    {level}
                </div>
            )}
        </div>
    )
}
