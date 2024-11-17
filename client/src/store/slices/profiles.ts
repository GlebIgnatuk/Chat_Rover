import { StateCreator } from 'zustand'
import { IProfilesState } from '../state'
import * as R from 'ramda'
import { ILoading } from '../common'

type IState = IProfilesState

export const createProfilesSlice: StateCreator<IState, [], [], IProfilesState> = (set) => ({
    profiles: {},
})
