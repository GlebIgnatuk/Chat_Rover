import backgroundImage from '@/assets/auth.jpeg'
import { useStore } from '@/context/app/useStore'
import { api } from '@/services/api'
import { IAppConfig, IIntl } from '@/store/types'
import { buildAuthUrl } from '@/utils/url'

import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export const InitializerPage = () => {
    // const [appConfig, setAppConfig] = useState<IAppConfig | null>(null)

    const appConfig = useStore((state) => state.appConfig)
    const settings = useStore((state) => state.settings)
    const toLoad = 3
    const [loaded, setLoaded] = useState(0)

    const loadAppConfig = async (signal?: AbortSignal): Promise<IAppConfig> => {
        const response = await api<IAppConfig>('/public/appConfig', { signal })
        if (response.success) {
            setLoaded((prev) => prev + 1)
            return response.data
        } else {
            console.error(response.error)
            throw new Error(response.error)
        }
    }

    const loadIntl = async (language: string, signal?: AbortSignal): Promise<IIntl> => {
        const response = await api<IIntl>(`/public/appConfig/intls/${language}`, { signal })
        if (response.success) {
            appConfig.addIntl(language, response.data)
            setLoaded((prev) => prev + 1)
            return response.data
        } else {
            console.error(response.error)
            throw new Error(response.error)
        }
    }

    const loadAll = async (signal?: AbortSignal) => {
        // @ts-expect-error add types
        const initData = window.Telegram.WebApp.initData
        const language = 'ru' //JSON.parse(new URLSearchParams(initData).get('user') ?? '{}').language_code

        const [config, preferredIntl, defaultIntl] = await Promise.allSettled([
            loadAppConfig(signal),
            loadIntl(language, signal),
            loadIntl('en', signal),
        ])

        if (config.status === 'fulfilled') {
            appConfig.setConfig(config.value)
        } else {
            // @todo
        }

        if (preferredIntl.status === 'fulfilled' && defaultIntl.status === 'fulfilled') {
            appConfig.addIntl(language, preferredIntl.value)
            appConfig.addIntl('en', defaultIntl.value)
            settings.setIntl(language, 'en')
        } else if (preferredIntl.status === 'fulfilled') {
            appConfig.addIntl(language, preferredIntl.value)
            settings.setIntl(language)
        } else if (defaultIntl.status === 'fulfilled') {
            appConfig.addIntl('en', defaultIntl.value)
            settings.setIntl('en')
        } else {
            // @todo
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        loadAll(abortController.signal)

        return () => {
            abortController.abort()ß
        }
    }, [])

    if (
        1 === 0 &&
        // loaded === toLoad &&
        appConfig.config !== null &&
        Object.keys(appConfig.intls).length !== 0 &&
        settings.intl !== null
    ) {
        return <Navigate to={buildAuthUrl('/signin')} />
    } else {
        return (
            <div className="pointer-events-none relative h-full flex justify-center items-center">
                <img
                    src={backgroundImage}
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom"
                />

                <div className="bg-black animate-pulse-25-50 absolute top-0 left-0 w-full h-full"></div>

                <div className="relative w-full flex flex-col items-center">
                    <div className="bg-black text-primary py-1 px-2 rounded-xl text-4xl">
                        Rover Chat
                    </div>

                    <div className="h-[2px] w-4/5 mt-3 bg-black">
                        <div
                            className="bg-primary h-full transition-all duration-500 w-0"
                            style={{
                                width: `${(loaded / toLoad) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        )
    }
}
