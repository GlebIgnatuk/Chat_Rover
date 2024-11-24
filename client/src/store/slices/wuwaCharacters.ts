import { StateCreator } from 'zustand'
import { IWuwaCharactersState } from '../state'
import * as R from 'ramda'
import { IWuwaCharacter } from '../types'

type IState = IWuwaCharactersState

export const createWuwaCharactersSlice =
    (items: IWuwaCharacter[]): StateCreator<IState, [], [], IWuwaCharactersState> =>
    () => ({
        wuwaCharacters: {
            items: R.indexBy(R.prop('_id'), items),
        },
    })
