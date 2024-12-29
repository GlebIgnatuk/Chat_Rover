import { api } from '@/services/api'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { buildProtectedUrl } from '@/utils/url'
import { useProfileForm } from '@/features/profiles/hooks/useProfileForm'
import { ProfileForm } from '@/features/profiles/components/ProfileForm'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { useAppConfig } from '@/context/initializer/useAppConfig'
import { useMemo, useState } from 'react'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { useAccount } from '@/context/account'
import * as R from 'ramda'
import { useStore } from '@/context/app/useStore'

export const ProfileScreen = () => {
    const { id: profileId } = useParams()
    const { profiles, ...account } = useAccount()
    const user = useStore((state) => state.identity.user)
    const profile = useMemo(() => profiles.find((p) => p._id === profileId), [profiles, profileId])

    const navigate = useNavigate()
    const localize = useLocalize()

    const [isLoading, setIsLoading] = useState(false)
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
        initialState: profile ? R.omit(['_id'], profile) : undefined,
        characters: characters,
        languages: langugages,
        servers: servers,
    })

    const onSubmit = async () => {
        setIsLoading(true)
        const response = await api(`/profiles/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify(form.state),
        })

        if (response.success) {
            setIsLoading(false)
            account.refresh()
            navigate(buildProtectedUrl('/account/profiles'), { replace: true })
        } else {
            const errors = response.details?.map((d) => ({
                key: d.path.join('.'),
                message: d.message,
            }))
            if (errors) {
                form.addErrors(...errors)
            }

            setIsLoading(false)
        }
    }

    if (!profile) return <Navigate to={buildProtectedUrl('/account/profiles')} />

    return (
        <div className="h-full overflow-y-auto">
            <div
                onClick={() =>
                    navigate(buildProtectedUrl(`/u/${user._id}/profiles/${profile._id}`))
                }
                className="bg-stone-800 text-primary-700 py-1 text-center cursor-pointer rounded-full border border-primary-700 mx-1 my-1"
            >
                Preview
            </div>

            <div className="pt-2 pb-10 flex flex-col items-center">
                <ProfileForm form={form} />
            </div>

            <div className="absolute bottom-0 left-0 w-full z-10">
                <button
                    onClick={() => onSubmit()}
                    className="bg-primary text-black w-full h-8 disabled:bg-gray-300 flex items-center justify-center gap-1"
                    disabled={isLoading}
                >
                    {!isLoading && <span>{localize('general__continue')}</span>}
                    {isLoading && (
                        <FontAwesomeIcon icon={faCircleNotch} className="w-3 h-3 animate-spin" />
                    )}
                </button>
            </div>
        </div>
    )
}
