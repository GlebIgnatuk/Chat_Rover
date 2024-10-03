import { useEffect, useState } from 'react'

export interface FormState {
    uid: number
    about: string
    nickname: string
    server: string
    usesVoice: boolean
    languages: string[]
    worldLevel: number
    team: {
        characterId: string
        level: number
        rank: number
    }[]
}

interface Props {
    initialState?: FormState
    onSubmit: (data: FormState) => unknown
}

const initialState: FormState = {
    uid: 0,
    about: '',
    nickname: '',
    server: '',
    usesVoice: true,
    languages: [],
    worldLevel: 0,
    team: [],
}

export const ProfileForm = (props: Props) => {
    const [state, setState] = useState<FormState>(props.initialState ?? initialState)

    const onSubmit = () => {
        props.onSubmit(state)
    }

    useEffect(() => {
        setState(props.initialState ?? initialState)
    }, [props.initialState])

    return <form onSubmit={onSubmit}>Form</form>
}
