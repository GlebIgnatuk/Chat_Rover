import { clearTelegramData } from '@/context/auth/auth'
import { useBatchedLoader } from '@/hooks/common/useBatchedLoader'
import { api } from '@/services/api'
import { IAppConfig, IIntl, IWuwaCharacter } from '@/store/types'
import { buildAuthUrl } from '@/utils/url'

import { useRef } from 'react'
import { Navigate } from 'react-router-dom'

export const SplashScreen = () => {
    const abortController = useRef<AbortController>()
    if (!abortController.current) {
        abortController.current = new AbortController()
    }

    const loadAppConfig = async (signal?: AbortSignal): Promise<IAppConfig> => {
        const response = await api<IAppConfig>('/public/appConfig', { signal })
        if (response.success) {
            return response.data
        } else {
            throw new Error(response.error)
        }
    }

    const loadIntl = async (language: string, signal?: AbortSignal): Promise<IIntl> => {
        const response = await api<IIntl>(`/public/intls/${language}`, { signal })
        if (response.success) {
            return response.data
        } else {
            throw new Error(response.error)
        }
    }

    const loadCharacters = async (signal?: AbortSignal) => {
        const response = await api<IWuwaCharacter[]>(`/public/wuwaCharacters`, { signal })
        if (response.success) {
            return response.data
        } else {
            throw new Error(response.error)
        }
    }

    //// @ts-expect-error add types
    // const initData = window.Telegram.WebApp.initData
    // @todo get language from tg context
    const sourceLanguage = 'ru'
    const alternativeLanguage = 'en'
    const intlsLoader = useBatchedLoader({
        values: [
            () => loadIntl(sourceLanguage, abortController.current?.signal),
            () => loadIntl(alternativeLanguage, abortController.current?.signal),
        ],
        onCancel: () => {
            abortController.current?.abort()
        },
    })
    const dataLoader = useBatchedLoader({
        values: [
            () => loadAppConfig(abortController.current?.signal),
            () => loadCharacters(abortController.current?.signal),
        ],
        failFast: true,
        onCancel: () => {
            abortController.current?.abort()
        },
    })

    if (intlsLoader.data && dataLoader.data) {
        try {
            const [appConfig, wuwaCharacters] = dataLoader.$unwrap()
            const [sourceIntlResult, alternativeIntlResult] = intlsLoader.data

            let intls: Record<string, IIntl>
            let selectedLanguage: string
            let fallbackLanguage: string | undefined = undefined

            if (
                sourceIntlResult.status === 'fulfilled' &&
                alternativeIntlResult.status === 'fulfilled'
            ) {
                selectedLanguage = sourceLanguage
                fallbackLanguage = alternativeLanguage
                intls = {
                    [sourceLanguage]: sourceIntlResult.value,
                    [alternativeLanguage]: alternativeIntlResult.value,
                }
            } else if (sourceIntlResult.status === 'fulfilled') {
                selectedLanguage = sourceLanguage
                intls = {
                    [sourceLanguage]: sourceIntlResult.value,
                }
            } else if (alternativeIntlResult.status === 'fulfilled') {
                selectedLanguage = alternativeLanguage
                intls = {
                    [alternativeLanguage]: alternativeIntlResult.value,
                }
            } else {
                throw new Error('Failed to load localization')
            }

            return (
                <Navigate
                    to={buildAuthUrl('/signin')}
                    state={{
                        __splash: {
                            appConfig,
                            wuwaCharacters,
                            intls,
                            selectedLanguage,
                            fallbackLanguage,
                        },
                    }}
                    replace
                />
            )
        } catch {
            return (
                <div className="pointer-events-none relative h-full flex justify-center items-center">
                    <div className="relative w-full flex flex-col items-center">
                        <div className="text-primary py-1 px-2 rounded-xl text-5xl border-primary border shadow-lg shadow-primary">
                            Failed to load!
                        </div>

                        <div
                            className="p-4 bg-red-500 cursor-pointer"
                            onClick={() => {
                                clearTelegramData()
                                window.location.href = '/'
                            }}
                        >
                            Retry
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div className="pointer-events-none relative h-full flex justify-center items-center">
                <div className="relative w-full flex flex-col items-center">
                    <div className="text-primary py-1 px-2 rounded-xl text-5xl border-primary border shadow-lg shadow-primary">
                        Rover Chat
                    </div>

                    <div className="h-[2px] w-4/5 mt-3 bg-transparent"></div>
                </div>
            </div>
        )
    }
}
