import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NowPageState {
  value: number
}

const initialState: NowPageState = {
  value: 0,
}

export const nowPageSlice = createSlice({
  name: 'nowPage',
  initialState,
  reducers: {
    setnowPageCount: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setnowPageCount } = nowPageSlice.actions

export default nowPageSlice.reducer
