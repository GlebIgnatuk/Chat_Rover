import { StateCreator } from 'zustand'
import { IShopState } from '../state'
import * as R from 'ramda'
import { IShopProduct } from '../types'

type IState = IShopState

export const createShopSlice =
    (products: IShopProduct[]): StateCreator<IState, [], [], IShopState> =>
    () => ({
        products: {
            items: R.indexBy(R.prop('_id'), products),
        },
    })
