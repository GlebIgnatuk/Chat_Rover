import { useSettings } from '@/context/initializer/useSettings'

export const useLocalize = () => {
    const settings = useSettings()

    return (path: string) => {
        if (!settings.intl) throw new Error('Intl not set')

        if (path in settings.intl) return settings.intl[path]
        if (settings.fallbackIntl && path in settings.fallbackIntl)
            return settings.fallbackIntl[path]

        return '???'
    }
}
