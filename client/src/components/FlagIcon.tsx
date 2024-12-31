import {
    CnFlagIcon,
    DeFlagIcon,
    EsFlagIcon,
    FrFlagIcon,
    JpFlagIcon,
    KrFlagIcon,
    UsFlagIcon,
} from '@/icons'
import { RuFlagIcon } from '@/icons/RuFlagIcon'

export const FLAGS_MAP: Record<
    string,
    { Icon: (props: { className?: string }) => JSX.Element; label: string }
> = {
    en: { Icon: UsFlagIcon, label: 'English' },
    'zh-CN': {
        Icon: CnFlagIcon,
        label: 'Chinise (simplified)',
    },
    'zh-HK': {
        Icon: CnFlagIcon,
        label: 'Chinise (traditional)',
    },
    ja: { Icon: JpFlagIcon, label: 'Japanese' },
    ko: { Icon: KrFlagIcon, label: 'Korean' },
    fr: { Icon: FrFlagIcon, label: 'French' },
    de: { Icon: DeFlagIcon, label: 'German' },
    es: { Icon: EsFlagIcon, label: 'Spanish' },
    ru: { Icon: RuFlagIcon, label: 'Russian' },
}

interface Props {
    code: keyof typeof FLAGS_MAP
    className?: string
}

export const FlagIcon = ({ code, className }: Props) => {
    const flag = FLAGS_MAP[code]
    if (!flag) return null

    return <flag.Icon className={className} />
}
