import { StateCreator } from 'zustand'
import { IGamesState } from '../state'
import * as R from 'ramda'
import { IGame } from '../types'

type IState = IGamesState

export const createGamesSlice =
    (games: IGame[]): StateCreator<IState, [], [], IGamesState> =>
    () => ({
        games: {
            items: R.indexBy(R.prop('slug'), games),
        },
    })
