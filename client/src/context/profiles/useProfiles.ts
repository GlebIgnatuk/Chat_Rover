import { useContext } from 'react'
import { ProfilesContext } from './ProfilesContext'

export const useProfiles = () => {
    const context = useContext(ProfilesContext)
    if (!context) throw new Error('useProfiles must be used within the provider')

    return {
        ...context,
        filters: context.state.filters,
        profiles: context.state.profiles.items,
        loading: context.state.profiles.loading,
    }
}
