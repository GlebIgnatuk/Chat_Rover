import { StateCreator } from 'zustand'
import { IIdentityState } from '../state'
import { IIdentity } from '@/context/auth/AuthContext'
import * as R from 'ramda'

type IState = IIdentityState

export const createIdentitySlice =
    (identity: IIdentity): StateCreator<IState, [], [], IIdentityState> =>
    (set) => ({
        identity: {
            ...identity,
            setUser: (user) => set((state) => R.assocPath(['identity', 'user'], user, state)),
        },
    })
