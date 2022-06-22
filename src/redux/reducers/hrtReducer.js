import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLeftNavOpen: false,
    toastIsOpen: false,
    toastMessage: '',
    toastSeverity: 'success',
}

const hrtSlice = createSlice({
  name: 'hrt',
  initialState,
  reducers: {
    setIsLeftNavOpen: (state, action) => {
      state.isLeftNavOpen = action.payload
    },
    setToastIsOpen: (state, action) => {
      state.toastIsOpen = action.payload
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload
    },
    setToastSeverity: (state, action) => {
      state.toastSeverity = action.payload
    }
  }
})

export const { setIsLeftNavOpen, setToastIsOpen, setToastMessage, setToastSeverity } = hrtSlice.actions
export default hrtSlice.reducer