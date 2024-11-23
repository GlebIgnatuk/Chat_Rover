import { StateCreator } from 'zustand'
import { IIdentityState } from '../state'
import { IIdentity } from '@/context/auth/AuthContext'

type IState = IIdentityState

export const createIdentitySlice =
    (identity: IIdentity): StateCreator<IState, [], [], IIdentityState> =>
    () => ({
        identity,
    })
