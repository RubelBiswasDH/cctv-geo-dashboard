import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLeftNavOpen: false
}

const hrtSlice = createSlice({
  name: 'hrt',
  initialState,
  reducers: {
    setIsLeftNavOpen: (state, action) => {
      state.isLeftNavOpen = action.payload
    }
  }
})

export const { setIsLeftNavOpen } = hrtSlice.actions
export default hrtSlice.reducer