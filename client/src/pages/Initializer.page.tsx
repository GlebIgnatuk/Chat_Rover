import { InitializerContext } from '@/context/initializer/InitializerContext'
import { useBatchedLoader } from '@/hooks/common/useBatchedLoader'
import { api } from '@/services/api'
import { createPublicStore, IPublicStore } from '@/store/store'
import { IAppConfig, IIntl } from '@/store/types'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { useStore } from 'zustand'

interface Props {
    children: ReactNode
}

export const InitializerPage = ({ children }: Props) => {
    const store = useRef<IPublicStore>()
    if (!store.current) {
        store.current = createPublicStore()
    }

    const abortController = useRef<AbortController>()
    if (!abortController.current) {
        abortController.current = new AbortController()
    }

    const appConfig = useStore(store.current, (state) => state.appConfig)
    const settings = useStore(store.current, (state) => state.settings)

    const [loaded, setLoaded] = useState(false)

    const loadAppConfig = async (signal?: AbortSignal): Promise<IAppConfig> => {
        const response = await api<IAppConfig>('/public/appConfig', { signal })
        if (response.success) {
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
            return response.data
        } else {
            console.error(response.error)
            throw new Error(response.error)
        }
    }

    //// @ts-expect-error add types
    // const initData = window.Telegram.WebApp.initData
    const language = 'ru'
    const loader = useBatchedLoader(
        [
            () => loadAppConfig(abortController.current?.signal),
            () => loadIntl(language, abortController.current?.signal),
            () => loadIntl('en', abortController.current?.signal),
        ],
        () => {
            abortController.current?.abort()
        },
    )

    useEffect(() => {
        if (!loader.data) return

        const [config, preferredIntl, defaultIntl] = loader.data

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

        setTimeout(() => setLoaded(true), 500)
    }, [loader.data])

    if (
        loaded &&
        Object.keys(appConfig.intls).length !== 0 &&
        appConfig.config !== null &&
        settings.intl !== null
    ) {
        return (
            <InitializerContext.Provider
                value={{
                    store: store.current,
                }}
            >
                {children}
            </InitializerContext.Provider>
        )
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
