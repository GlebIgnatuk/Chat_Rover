import { IIdentity } from '@/context/auth/AuthContext'
import { useAppConfig } from '@/context/initializer/useAppConfig'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { ProfileForm } from '@/features/profiles/components/ProfileForm'
import { useProfileForm } from '@/features/profiles/hooks/useProfileForm'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { api } from '@/services/api'
import { buildProtectedUrl } from '@/utils/url'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import bgImage from '@/assets/auth.jpeg'
import cardBgImage from '@/assets/profile-card-bg.webp'
import { cn } from 'tailwind-cn'

export const SignUpProfileScreen = () => {
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
    }, [gameConfig])
    const servers = useMemo(() => {
        return gameConfig.servers.map((l) => ({ key: l, value: l }))
    }, [gameConfig])

    const form = useProfileForm({
        characters: characters,
        languages: langugages,
        servers: servers,
    })

    // const onSubmit = async (data: FormState) => {
    //     const response = await api('/profiles', {
    //         method: 'post',
    //         body: JSON.stringify(data),
    //     })

    //     if (response.success) {
    //         const response = await api<IIdentity>('/users/me')
    //         if (response.success) {
    //             navigate(buildProtectedUrl('/'), { replace: true, state: { user: response.data } })
    //         } else {
    //             console.error(response.error)
    //         }
    //     } else {
    //         console.error(response.error)
    //     }
    // }

    return (
        <div className="relative h-full overflow-y-auto">
            <img src={bgImage} className="absolute inset-0 object-cover object-center opacity-25" />

            <div className="flex flex-col items-center py-10" style={{ perspective: '1000px' }}>
                <div
                    className={cn('relative w-[370px] rounded-xl transition-all duration-700', {
                        'shadow-[0px_0px_24px_2px_rgba(255,215,0,0.75)]': isCardOpen,
                        'shadow-[0px_0px_24px_2px_rgba(255,215,0,0.25)]': !isCardOpen,
                    })}
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
                        className="absolute inset-0 bg-black rounded-xl overflow-hidden flex items-center justify-center cursor-pointer font-vasek"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        onClick={() => setIsCardOpen(true)}
                    >
                        <div className="absolute text-4xl text-center">
                            Let's create a profile!
                            <br />
                            Tap to start
                        </div>

                        <img
                            src={cardBgImage}
                            className="absolute top-0 left-0 w-full h-full object-center object-cover animate-pulse-25-50"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
