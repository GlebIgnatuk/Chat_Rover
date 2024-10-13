import { Icon } from './Icon'

interface Props {
    className?: string
}

export const DeFlagIcon = (props: Props) => {
    return (
        <Icon {...props}>
            <path fill="#fc0" d="M0 341.3h512V512H0z" />
            <path fill="#000001" d="M0 0h512v170.7H0z" />
            <path fill="red" d="M0 170.7h512v170.6H0z" />
        </Icon>
    )
}
