import { useStore } from '@/context/app/useStore'
import { api } from '@/services/api'
import { ICommunityState } from '@/store/state'
import { ISearchedProfile } from '@/store/types'
import { useState } from 'react'

type FiltersState = ICommunityState['community']['filters']

type Filters = {
    [K in keyof FiltersState as FiltersState[K] extends (...args: unknown[]) => unknown
        ? never
        : K]: FiltersState[K]
}

const encodeFilters = (filters: Filters) => {
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
    if (filters.usesVoice !== undefined) query.append('usesVoice', filters.usesVoice.toString())

    for (const language of filters.languages) {
        query.append('languages[]', language)
    }

    if (filters.minWorldLevel !== 0) query.append('minWorldLevel', filters.minWorldLevel.toString())
    if (filters.maxWorldLevel !== 8) query.append('maxWorldLevel', filters.maxWorldLevel.toString())

    return query
}

export const ITEMS_PER_PAGE = 20

export const useSearch = () => {
    const [page, setPage] = useState(1)

    const state = useStore((state) => state.community)
    const loading = state.loading.items.$ ?? { is: false }
    const canMoveBackwards = page > 1
    const canMoveForward =
        state.searchedItems.length !== 0 && state.searchedItems.length % ITEMS_PER_PAGE === 0

    const search = async (nextPage: number = 1, filters?: Filters, signal?: AbortSignal) => {
        const previousPage = page

        try {
            state.loading.start()
            setPage(nextPage)

            const nextQuery = filters ? encodeFilters(filters) : new URLSearchParams()

            nextQuery.append('page', nextPage.toString())
            nextQuery.append('limit', ITEMS_PER_PAGE.toString())

            if (nextPage === 1) {
                state.setSearchedItems([])
            }

            const response = await api<ISearchedProfile[]>(`/profiles?${nextQuery}`, { signal })
            if (response.success) {
                await new Promise((res) => setTimeout(res, 2000))
                if (nextPage > 1) {
                    state.appendSearchedItems(response.data)
                } else {
                    state.setSearchedItems(response.data)
                }
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

    const reset = () => {
        state.filters.reset()
        search()
    }

    const goBack = (signal?: AbortSignal) => {
        if (!canMoveBackwards) return

        return search(page - 1, state.filters, signal)
    }

    const goForward = (signal?: AbortSignal) => {
        if (!canMoveForward) return

        return search(page + 1, state.filters, signal)
    }

    return {
        search,
        goBack,
        goForward,
        reset,
        page,
        canMoveBackwards,
        canMoveForward,
        loading,
        filters: state.filters,
        items: state.searchedItems,
    }
}
