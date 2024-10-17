import { StateCreator } from 'zustand'
import { IP2PState } from '../state'
import * as R from 'ramda'
import { ILoading } from '../common'

type IState = IP2PState

export const createP2PSlice: StateCreator<IState, [], [], IP2PState> = (set) => ({
    p2p: {
        items: {},
        add: (item) => {
            set((state) => {
                return R.assocPath(['p2p', 'items', item.peer._id], item, state)
            })
        },
        addMany: (items) => {
            set((state) => {
                const indexed = R.indexBy((item) => item.peer._id, items)
                const merged = R.mergeRight(state.p2p.items, indexed)
                return R.assocPath(['p2p', 'items'], merged, state)
            })
        },

        loading: {
            items: {},
            start: (key) => {
                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chats', 'loading', 'items', key ?? '$'],
                        { is: true },
                        state,
                    )
                })
            },
            stop: (key) => {
                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chats', 'loading', 'items', key ?? '$'],
                        { is: false },
                        state,
                    )
                })
            },
            stopWithError: (error, key) => {
                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chats', 'loading', 'items', key ?? '$'],
                        { is: false, error },
                        state,
                    )
                })
            },
        },
    },
})
