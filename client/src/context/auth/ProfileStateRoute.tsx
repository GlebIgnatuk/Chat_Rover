import { useLocation, useNavigate } from 'react-router-dom'
import { ReactNode, useLayoutEffect } from 'react'
import { clearTelegramData, inferProfileState, ProfileState } from './auth'
import { buildPublicPath } from '@/config/path'

interface Props {
    state: ProfileState
    children: ReactNode
}

export const ProfileStateRoute = ({ children, ...props }: Props) => {
    const { state: locationState } = useLocation()
    const state = inferProfileState(locationState?.user)

    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (state === props.state) return

        clearTelegramData()
        navigate(buildPublicPath('/'), { replace: true })
    }, [state, props.state])

    return state === props.state ? children : null
}
