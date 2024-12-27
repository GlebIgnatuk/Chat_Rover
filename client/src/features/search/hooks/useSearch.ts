import { useStore } from '@/context/app/useStore'
import { api } from '@/services/api'
import { ISearchedProfile } from '@/store/types'
import { useState } from 'react'

// export interface UseSearchOptions {}

export const useSearch = () => {
    const [page, setPage] = useState(1)

    const state = useStore((state) => state.community)
    const loading = state.loading.items.$ ?? { is: false }

    const search = async (nextPage: number = 1, signal?: AbortSignal) => {
        const previousPage = page

        try {
            state.loading.start()
            setPage(nextPage)

            const filters = state.filters

            const query = new URLSearchParams()
            for (let i = 0; i < filters.team.length; i++) {
                const t = filters.team[i]
                if (!t) continue

                if (t.characterId) query.append(`team[${i}][characterId]`, t.characterId)
                if (t.minConstellation)
                    query.append(`team[${i}][minConstellation]`, t.minConstellation.toString())
                if (t.maxConstellation)
                    query.append(`team[${i}][maxConstellation]`, t.maxConstellation.toString())
                if (t.minLevel) query.append(`team[${i}][minLevel]`, t.minLevel.toString())
                if (t.maxLevel) query.append(`team[${i}][maxLevel]`, t.maxLevel.toString())
            }

            if (filters.server) query.append('server', filters.server)
            if (filters.usesVoice !== undefined)
                query.append('usesVoice', filters.usesVoice.toString())

            for (const language of filters.languages) {
                query.append('languages[]', language)
            }

            if (filters.minWorldLevel !== 0)
                query.append('minWorldLevel', filters.minWorldLevel.toString())
            if (filters.maxWorldLevel !== 8)
                query.append('maxWorldLevel', filters.maxWorldLevel.toString())

            query.append('page', nextPage.toString())
            query.append('limit', '10')

            const response = await api<ISearchedProfile[]>(`/profiles?${query}`, { signal })
            if (response.success) {
                state.setSearchedItems(response.data)
                state.loading.stop()
            } else {
                setPage(previousPage)
                state.loading.stopWithError(response.error)
            }
        } catch (e) {
            console.error(e)
            setPage(previousPage)
            state.loading.stopWithError('Something went wrong')
        }
    }

    const goBack = (signal?: AbortSignal) => {
        if (page === 1) return

        return search(page - 1, signal)
    }

    const goForward = (signal?: AbortSignal) => {
        return search(page + 1, signal)
    }

    return {
        search,
        goBack,
        goForward,
        page,
        loading,
        filters: state.filters,
        items: state.searchedItems,
    }
}
