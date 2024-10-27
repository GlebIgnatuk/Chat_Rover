import { StateCreator } from 'zustand'
import { IOnlineState } from '../state'
import * as R from 'ramda'
import { IUser } from '../types'

type IState = IOnlineState

export const createOnlineSlice: StateCreator<IState, [], [], IOnlineState> = (set) => ({
    online: {
        items: {},
        add: (item) => {
            set((state) => {
                return R.assocPath(
                    ['online', 'items', item._id],
                    new Date(item.lastActivityAt),
                    state,
                )
            })
        },
        addMany: (items) => {
            set((state) => {
                const indexed = R.mapObjIndexed<IUser, Date>(
                    (v) => new Date(v.lastActivityAt),
                    R.indexBy((item) => item._id, items),
                )
                const merged = R.mergeRight(state.online.items, indexed)
                return R.assocPath(['online', 'items'], merged, state)
            })
        },
        remove: (item) => {
            set((state) => {
                return R.dissocPath(['online', 'items', item], state)
            })
        },
        invalidate: () => {
            return set((state) =>
                R.assocPath(['online', 'items'], { ...state.online.items }, state),
            )
        },
    },
})
