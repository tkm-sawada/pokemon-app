import { configureStore } from '@reduxjs/toolkit'
import nowPageReducer from '../features/nowPage/nowPageSlice'
import pokemonDataReducer from '../features/pokemonData/pokemonDataSlice'

export const store = configureStore({
  reducer: {
    nowPage: nowPageReducer,
    pokemonData: pokemonDataReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
