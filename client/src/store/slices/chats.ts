// import { StateCreator } from 'zustand'
// import { IChatsState, IP2PState } from '../state'
// import { IPrivateChatWithMetadata } from '../types'

// const indexItems = (items: IPrivateChatWithMetadata[]) => {
//     return items.reduce<IChatsState['chats']['items']>((acc, n) => {
//         acc[n._id] = n
//         return acc
//     }, {})
// }

// export const createChatsSlice: StateCreator<IChatsState & IP2PState, [], [], IChatsState> = (
//     set,
//     get,
// ) => ({
//     chats: {
//         items: {},
//         addMany: (items) =>
//             set((state) => {
//                 const indexed = indexItems(items)

//                 // const chatsMessages = action.payload.reduce<IState['chatsMessages']['items']>(
//                 //     (acc, chat) => {
//                 //         acc[chat._id] = []
//                 //         return acc
//                 //     },
//                 //     {},
//                 // )

//                 get().p2p.addMany(items)

//                 return {
//                     ...state,
//                     chats: { ...state.chats, items: { ...state.chats.items, ...indexed } },
//                 }
//             }),

//         loading: { is: false },
//         startLoading: () => set((state) => ({ chats: { ...state.chats, loading: { is: true } } })),
//         stopLoading: () => set((state) => ({ chats: { ...state.chats, loading: { is: false } } })),
//         stopLoadingWithError: (error) =>
//             set((state) => ({ chats: { ...state.chats, loading: { is: false, error } } })),
//     },
// })
