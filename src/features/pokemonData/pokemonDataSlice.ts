import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NowPageState {
  value: number
}

const initialState: NowPageState = {
  value: 0,
}

export const pokemonDataSlice = createSlice({
  name: 'nowPage',
  initialState,
  reducers: {
    setPokemonData: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPokemonData } = pokemonDataSlice.actions

export default pokemonDataSlice.reducer
