import { StateCreator } from 'zustand'
import { IExpressGiveawaysState } from '../state'
import * as R from 'ramda'
import { IListingExpressGiveaway } from '../types'

type IState = IExpressGiveawaysState

export const createExpressGiveawaysSlice =
    (giveaways: IListingExpressGiveaway[]): StateCreator<IState, [], [], IExpressGiveawaysState> =>
    (set) => ({
        expressGiveaways: {
            items: giveaways,
            setItems: (items) => {
                set((state) => R.assocPath(['expressGiveaways', 'items'], items, state))
            },
        },
    })
