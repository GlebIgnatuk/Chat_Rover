import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { useStore } from '@/context/app/useStore'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { useRenderedProfile } from '@/features/profiles/hooks/useRenderedProfile'
import { useBatchedLoader } from '@/hooks/common/useBatchedLoader'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { api } from '@/services/api'
import { ISearchedProfile } from '@/store/types'
import { Modal } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const RenderedProfileScreen = () => {
    const { profileId } = useParams()

    const loadProfile = async () => {
        const result = await api<ISearchedProfile[]>(`/profiles?id=${profileId}`)
        if (result.success) {
            return result.data[0]!
        } else {
            throw new Error('Something went wrong')
        }
    }

    const loader = useBatchedLoader({
        onCancel: () => {},
        values: [() => loadProfile()],
    })

    if (!loader.data) {
        return (
            <div className="flex justify-center items-center h-full">
                <CircularLoaderIndicator size="xl" />
            </div>
        )
    }

    try {
        const [profile] = loader.$unwrap()

        return (
            <div className="h-full overflow-hidden">
                <div className="h-full relative overflow-auto">
                    <Rendered profile={profile} />
                </div>
            </div>
        )
    } catch (e) {
        return <div className="flex justify-center items-center h-full">{(e as Error).message}</div>
    }
}

interface RenderedProps {
    profile: ISearchedProfile
}

const Rendered = ({ profile }: RenderedProps) => {
    const [error, setError] = useState<string | null>(null)
    const user = useStore((state) => state.identity.user)
    const characters = useWuwaCharacters((state) => state.items)
    const localize = useLocalize()
    const { ref, isDrawing, isDownloading, download } = useRenderedProfile({
        characters,
        profile,
        width: 380,
        height: 660,
    })

    return (
        <div className="flex flex-col items-center px-2 py-2">
            {!isDrawing && user._id === profile.user._id && (
                <button
                    onClick={() =>
                        download()
                            .then(() => alert('Success'))
                            .catch((e) => setError(e.message))
                    }
                    disabled={isDownloading}
                    className="bg-stone-800 disabled:bg-stone-400 text-primary-700 px-4 py-2 text-center self-stretch font-medium rounded-full my-1"
                >
                    Export
                </button>
            )}

            <canvas
                ref={ref}
                className={cn('opacity-100 transition-opacity duration-300 w-full h-full', {
                    'opacity-0': isDrawing,
                })}
            ></canvas>

            {isDrawing && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <CircularLoaderIndicator size="xl" />
                </div>
            )}

            <Modal open={error !== null}>
                <div className="text-white text-lg text-center h-full flex flex-col gap-3 items-center justify-center px-2">
                    <div className="text-red-500">{localize('general__error')}!</div>

                    <div>
                        {localize('exports__error__bot_start').replace(
                            '%url',
                            import.meta.env.VITE_BOT_URL,
                        )}
                    </div>

                    <button
                        className="bg-stone-800 text-primary-700 border border-primary-700 rounded-full px-4 py-1"
                        onClick={() => setError(null)}
                    >
                        {localize('general__dismiss')}
                    </button>
                </div>
            </Modal>
        </div>
    )
}
