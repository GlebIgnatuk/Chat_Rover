import { StateCreator } from 'zustand'
import { ICommunityState } from '../state'
import * as R from 'ramda'

type IState = ICommunityState

export const createCommunitySlice: StateCreator<IState, [], [], ICommunityState> = (set) => ({
    community: {
        searchedItems: [],
        setSearchedItems: (items) => {
            set((state) => R.assocPath(['community', 'searchedItems'], items, state))
        },
        invalidateSearchedItems: () => {
            set((state) => R.assocPath(['community', 'searchedItems'], [], state))
        },

        loading: {
            items: {
                $: { is: false },
            },
            start: () => {
                set((state) =>
                    R.assocPath(['community', 'loading', 'items', '$', 'is'], true, state),
                )
            },
            stop: () => {
                set((state) =>
                    R.assocPath(['community', 'loading', 'items', '$', 'is'], false, state),
                )
            },
            stopWithError(error) {
                set((state) =>
                    R.assocPath(
                        ['community', 'loading', 'items', '$'],
                        { is: false, error },
                        state,
                    ),
                )
            },
        },
        filters: {
            team: [null, null, null],
            addTeamMember: (at, characterId) => {
                set((state) => {
                    const team = [...state.community.filters.team]
                    team[at] = {
                        characterId,
                        minConstellation: 0,
                        maxConstellation: 6,
                        minLevel: 0,
                        maxLevel: 90,
                    }

                    return R.assocPath(['community', 'filters', 'team'], team, state)
                })
            },
            setTeamMemberMinLevel: (at, level) => {
                set((state) => {
                    const team = [...state.community.filters.team]
                    if (!team[at]) return state

                    team[at] = { ...team[at], minLevel: level }

                    return R.assocPath(['community', 'filters', 'team'], team, state)
                })
            },
            setTeamMemberMaxLevel: (at, level) => {
                set((state) => {
                    const team = [...state.community.filters.team]
                    if (!team[at]) return state

                    team[at] = { ...team[at], maxLevel: level }

                    return R.assocPath(['community', 'filters', 'team'], team, state)
                })
            },
            setTeamMemberMinConstellation: (at, constellation) => {
                set((state) => {
                    const team = [...state.community.filters.team]
                    if (!team[at]) return state

                    team[at] = { ...team[at], minConstellation: constellation }

                    return R.assocPath(['community', 'filters', 'team'], team, state)
                })
            },
            setTeamMemberMaxConstellation: (at, constellation) => {
                set((state) => {
                    const team = [...state.community.filters.team]
                    if (!team[at]) return state

                    team[at] = { ...team[at], maxConstellation: constellation }

                    return R.assocPath(['community', 'filters', 'team'], team, state)
                })
            },

            server: undefined,
            setServer: (server) => {
                set((state) => R.assocPath(['community', 'filters', 'server'], server, state))
            },
            unsetServer: () => {
                set((state) => R.assocPath(['community', 'filters', 'server'], undefined, state))
            },

            usesVoice: undefined,
            setVoice: (value) => {
                set((state) => R.assocPath(['community', 'filters', 'usesVoice'], value, state))
            },
            unsetVoice: () => {
                set((state) => R.assocPath(['community', 'filters', 'usesVoice'], undefined, state))
            },

            languages: [],
            addLanguage: (language) => {
                set((state) => {
                    const languages = state.community.filters.languages
                    if (languages.includes(language)) {
                        return state
                    } else {
                        return R.assocPath(
                            ['community', 'filters', 'languages'],
                            [...languages, language],
                            state,
                        )
                    }
                })
            },
            removeLanguage: (language) => {
                set((state) => {
                    const languages = state.community.filters.languages
                    const filtered = languages.filter((l) => l !== language)
                    return R.assocPath(['community', 'filters', 'languages'], filtered, state)
                })
            },

            minWorldLevel: 0,
            setMinWorldLevel: (level) => {
                set((state) =>
                    R.assocPath(
                        ['community', 'filters', 'minWorldLevel'],
                        Math.max(level, 0),
                        state,
                    ),
                )
            },

            maxWorldLevel: 8,
            setMaxWorldLevel: (level) => {
                set((state) =>
                    R.assocPath(
                        ['community', 'filters', 'maxWorldLevel'],
                        Math.min(level, 8),
                        state,
                    ),
                )
            },
        },
    },
})
