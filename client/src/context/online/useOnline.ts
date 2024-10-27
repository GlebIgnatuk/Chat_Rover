import { useContext } from 'react'
import { OnlineContext } from './OnlineContext'

export const useOnline = () => {
    const online = useContext(OnlineContext)

    if (online === undefined) {
        throw new Error('useOnline must be used within the contenxt provider')
    }

    return online
}
