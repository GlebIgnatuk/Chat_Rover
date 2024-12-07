import { useAppConfig } from '@/context/initializer/useAppConfig'
import { useSettings } from '@/context/initializer/useSettings'

export const useLocalize = () => {
    const language = useSettings((state) => state.language)
    const fallbackLanguage = useSettings((state) => state.fallbackLanguage)

    const intl = useAppConfig((state) => state.intls[language])
    const fallbackIntl = useAppConfig((state) =>
        fallbackLanguage ? state.intls[fallbackLanguage] : null,
    )

    return (path: string) => {
        if (!intl) throw new Error('Intl not set')

        if (path in intl) return intl[path]!
        if (fallbackIntl && path in fallbackIntl) return fallbackIntl[path]!

        return '<?>'
    }
}
