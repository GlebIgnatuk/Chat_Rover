import { IIdentity } from '@/context/auth/AuthContext'
import { useAppConfig } from '@/context/initializer/useAppConfig'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { ProfileForm } from '@/features/profiles/components/ProfileForm'
import { useProfileForm } from '@/features/profiles/hooks/useProfileForm'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { api } from '@/services/api'
import { buildProtectedUrl } from '@/utils/url'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import bgImage from '@/assets/auth.jpeg'
import cardBgImage from '@/assets/profile-card-bg.webp'
import { cn } from 'tailwind-cn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

export const SignUpProfileScreen = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isCardOpen, setIsCardOpen] = useState(false)

    const navigate = useNavigate()
    const localize = useLocalize()

    const characters = useWuwaCharacters((state) => state.items)
    const gameConfig = useAppConfig((state) => state.config.game)
    const langugages = useMemo(() => {
        return gameConfig.languages.map((l) => ({
            key: l,
            value: localize(`general__languages__${l}`),
        }))
    }, [gameConfig, localize])
    const servers = useMemo(() => {
        return gameConfig.servers.map((l) => ({ key: l, value: l }))
    }, [gameConfig])

    const form = useProfileForm({
        characters: characters,
        languages: langugages,
        servers: servers,
    })

    const onSubmit = async () => {
        setIsLoading(true)

        const response = await api('/profiles', {
            method: 'post',
            body: JSON.stringify(form.state),
        })

        if (response.success) {
            const response = await api<IIdentity>('/users/me')
            if (response.success) {
                setIsCardOpen(false)
                setTimeout(() => {
                    setIsLoading(false)
                    navigate(buildProtectedUrl('/'), {
                        replace: true,
                        state: { user: response.data },
                    })
                }, 400)
            } else {
                setIsLoading(false)
                console.error(response.error)
            }
        } else {
            setIsLoading(false)

            const errors = response.details?.map((d) => ({
                key: d.path.join('.'),
                message: d.message,
            }))
            if (errors) {
                form.addErrors(...errors)
            }

            console.error(response.error)
        }
    }

    return (
        <div className="relative h-full overflow-y-auto">
            <img
                src={bgImage}
                className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-25"
            />

            <div
                className="flex flex-col items-center h-full pt-2 pb-10 overflow-y-auto"
                style={{ perspective: '1000px' }}
            >
                <div
                    className={cn(
                        'relative max-w-[370px] w-[90%] rounded-xl transition-all duration-300',
                        {
                            'shadow-[0px_0px_24px_2px_rgba(255,215,0,0.75)]': isCardOpen,
                            'shadow-[0px_0px_24px_2px_rgba(255,215,0,0.25)]': !isCardOpen,
                        },
                    )}
                    style={{
                        transform: isCardOpen ? 'rotateY(0deg)' : 'rotateY(180deg)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <div
                        className={cn('relative rounded-xl', {
                            'pointer-events-none': !isCardOpen,
                        })}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <ProfileForm form={form} />
                    </div>

                    <div
                        className="absolute top-0 left-0 w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center cursor-pointer font-vasek"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        onClick={() => setIsCardOpen(true)}
                    >
                        <div className="absolute text-5xl text-center">
                            {localize('auth__profile__info1')}
                            <br />
                            {localize('auth__profile__info2')}
                        </div>

                        <img
                            src={cardBgImage}
                            className="absolute top-0 left-0 w-full h-full object-center object-cover animate-pulse-25-50"
                        />
                    </div>
                </div>
            </div>

            {isCardOpen && (
                <div className="absolute bottom-0 left-0 w-full">
                    <button
                        onClick={() => onSubmit()}
                        className="bg-primary text-black w-full h-8 disabled:bg-gray-300 flex items-center justify-center gap-1"
                        disabled={isLoading}
                    >
                        {!isLoading && <span>{localize('general__continue')}</span>}
                        {isLoading && (
                            <FontAwesomeIcon
                                icon={faCircleNotch}
                                className="w-3 h-3 animate-spin"
                            />
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
