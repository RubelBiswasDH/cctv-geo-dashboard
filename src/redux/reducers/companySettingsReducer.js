import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    settings: [],
}

const companySettingsSlice = createSlice({
  name: 'companySettings',
  initialState,
  reducers: {

    setSettings: (state, action) => {
      state.settings = action.payload
    },
    updateSettngs: (state, action) => {
      state.settngs = {...state.settings, ...action.payload}
    },
  }
})

export const { setSettings, updateSettngs } = companySettingsSlice.actions
export default companySettingsSlice.reducer