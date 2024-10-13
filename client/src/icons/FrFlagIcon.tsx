import { Icon } from './Icon'

interface Props {
    className?: string
}

export const FrFlagIcon = (props: Props) => {
    return (
        <Icon {...props}>
            <path fill="#fff" d="M0 0h512v512H0z" />
            <path fill="#000091" d="M0 0h170.7v512H0z" />
            <path fill="#e1000f" d="M341.3 0H512v512H341.3z" />
        </Icon>
    )
}
