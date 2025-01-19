import { Card } from '@/components/Card'
import { IProfile } from '@/context/account/AccountContext'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { IUser } from '@/store/types'
import { CharacterAvatar } from './ProfileForm/CharacterAvatar'
import { buildImageUrl } from '@/utils/url'
import { FlagIcon } from '@/components/FlagIcon'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { cn } from 'tailwind-cn'

export interface ProfileCardProps {
    profile: Pick<
        IProfile,
        'languages' | 'nickname' | 'server' | 'team' | 'usesVoice' | 'worldLevel'
    >
    user: IUser

    onClick?: () => void
    onNicknameClick?: () => void
}

export const ProfileCard = ({ profile, user, onClick, onNicknameClick }: ProfileCardProps) => {
    const characters = useWuwaCharacters((state) => state.items)
    const localize = useLocalize()

    return (
        <Card className="cursor-pointer" onClick={onClick}>
            <div className="pl-2 flex items-start justify-between">
                <div
                    className="pt-1"
                    onClick={(e) => {
                        if (!onNicknameClick) return
                        e.stopPropagation()
                        onNicknameClick?.()
                    }}
                >
                    <span
                        className={cn('font-semibold text-accent', {
                            underline: onNicknameClick !== undefined,
                        })}
                    >
                        {profile.nickname}
                    </span>
                    <span className="text-gray-400"> / </span>
                    <span className="text-xs text-accent">{user.nickname}</span>
                </div>

                <div className="text-xs w-16 bg-stone-800 border border-primary-700 text-primary-700 rounded-tr-xl rounded-bl-xl text-center">
                    {profile.server}
                </div>
            </div>

            <div className="px-2 my-1 grid grid-cols-[max-content,minmax(0,1fr),max-content] items-center">
                <AccountAvatar url={user.avatarUrl} nickname={user.nickname} size="2xl" />

                <div className="border-t border-primary-700"></div>

                <div className="relative flex gap-2 justify-end">
                    <div className="absolute w-full top-1/2 -translate-y-1/2 border-t border-primary-700 -z-10"></div>

                    {profile.team.map((t, idx) => (
                        <CharacterAvatar
                            key={idx}
                            size="xl"
                            url={
                                t ? buildImageUrl(characters[t.characterId]?.photoPath ?? '') : null
                            }
                            level={t ? t.level : undefined}
                            constellation={t ? t.constellation : undefined}
                        />
                    ))}
                </div>
            </div>

            <div className="px-2 pb-1">
                <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-primary-700">
                        {localize('auth__profile__world_level')}
                    </span>
                    <span className="text-xs text-gray-300">Rank {profile.worldLevel}</span>
                </div>
                <hr className="border-gray-500 border-1" />
                <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-primary-700">
                        {localize('auth__profile__voice')}
                    </span>
                    <span className="text-xs text-gray-300">
                        {profile.usesVoice ? 'Yes' : 'No'}
                    </span>
                </div>
                <hr className="border-gray-500 border-1" />
                <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-primary-700">
                        {localize('auth__profile__languages')}
                    </span>
                    <span className="flex gap-1">
                        {profile.languages.map((lang) => (
                            <div
                                key={lang}
                                className="bg-stone-800 pr-2 flex gap-2 items-center rounded-xl overflow-hidden border border-primary-700"
                            >
                                <FlagIcon code={lang} className="w-5 h-5" />
                                <span className="uppercase text-xs text-gray-300">{lang}</span>
                            </div>
                        ))}
                    </span>
                </div>
            </div>
        </Card>
    )
}
