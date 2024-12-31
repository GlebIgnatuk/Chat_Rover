import { clearTelegramData } from '@/context/auth/auth'
import { useBatchedLoader } from '@/hooks/common/useBatchedLoader'
import { api } from '@/services/api'
import { loadAssetAsync } from '@/services/AssetsCache'
import { IAppConfig, IIntl, IWuwaCharacter } from '@/store/types'
import { buildAuthUrl, buildImageUrl } from '@/utils/url'

import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import TagManager from 'react-gtm-module'

import bgAnimation from '@/assets/bg_animation.mp4'
import bgCard from '@/assets/profile-card-bg.webp'
import cnFlag from '@/assets/cn.svg'
import deFlag from '@/assets/de.svg'
import esFlag from '@/assets/es.svg'
import ruFlag from '@/assets/ru.svg'
import frFlag from '@/assets/fr.svg'
import jpFlag from '@/assets/jp.svg'
import krFlag from '@/assets/kr.svg'
import usFlag from '@/assets/us.svg'

const getSourceLanguage = (data: string) => {
    try {
        const params = new URLSearchParams(data)
        const user = params.get('user') || ''
        return JSON.parse(user).language_code
    } catch {
        return 'en'
    }
}

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
        const response = await api<IIntl>(`/public/translations/${language}`, { signal })
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

    // @ts-expect-error add types
    const sourceLanguage = getSourceLanguage(window.Telegram.WebApp.initData)
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
            () => new Promise((res) => setTimeout(res, 1000)),
        ],
        failFast: true,
        onCancel: () => {
            abortController.current?.abort()
        },
    })

    useEffect(() => {
        loadAssetAsync('video', bgAnimation)
        loadAssetAsync('img', bgCard)
        loadAssetAsync('img', usFlag)
        loadAssetAsync('img', jpFlag)
        loadAssetAsync('img', krFlag)
        loadAssetAsync('img', frFlag)
        loadAssetAsync('img', deFlag)
        loadAssetAsync('img', esFlag)
        loadAssetAsync('img', ruFlag)
        loadAssetAsync('img', cnFlag)
    }, [])

    useEffect(() => {
        TagManager.initialize({
            gtmId: import.meta.env.VITE_GTM_ID,
        })
    }, [])

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

            for (const character of wuwaCharacters) {
                loadAssetAsync('img', buildImageUrl(character.photoPath))
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
        } catch (e) {
            return (
                <div className="relative h-full flex justify-center items-center bg-[#131313]">
                    <div className="relative flex flex-col items-center gap-5">
                        <div
                            className="relative text-red-100 py-1 px-2 rounded-lg text-5xl"
                            style={{
                                textShadow: `0 0 7px #fff,
        0 0 10px #ff0000,
        0 0 21px #ff0000,
        0 0 42px #ff0000,
            0 0 82px #ff0000`,
                            }}
                        >
                            Failed to load
                        </div>

                        <div className="w-4/5 break-all text-center">
                            Reason: {(e as Error).message}
                        </div>

                        <div
                            className="px-6 py-2 border-primary-700 border rounded-lg cursor-pointer bg-stone-800"
                            onClick={() => {
                                clearTelegramData()
                                window.location.reload()
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
            <div className="pointer-events-none relative h-full flex justify-center items-center bg-[#131313]">
                <div className="relative flex flex-col items-center">
                    <div
                        className="relative text-white py-1 px-2 rounded-lg text-5xl"
                        style={{
                            textShadow: `0 0 7px #fff,
                        0 0 10px #f6cb66,
                        0 0 21px #f6cb66,
                        0 0 42px #f6cb66,
                            0 0 82px #f6cb66`,
                        }}
                    >
                        Rover Chat
                    </div>
                </div>
            </div>
        )
    }
}
