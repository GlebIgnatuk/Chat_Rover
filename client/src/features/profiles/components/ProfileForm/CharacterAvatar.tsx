import { cn } from 'tailwind-cn'

export interface CharacterAvatarProps {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    url?: string | null
    bordered?: boolean
}

export const CharacterAvatar = ({ size, bordered, url }: CharacterAvatarProps) => {
    return (
        <div
            className={cn(
                'flex items-center justify-center rounded-full text-primary-700 bg-gradient-to-b from-stone-800 to-stone-700 uppercase font-semibold overflow-hidden',
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
        </div>
    )
}
