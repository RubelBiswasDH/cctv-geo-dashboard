import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    settings: {
      departments:{}
    },
    currentDepartment:'',
    currentDesignations: {},
    
}

const companySettingsSlice = createSlice({
  name: 'companySettings',
  initialState,
  reducers: {

    setSettings: (state, action) => {
      state.settings = action.payload
    },
    updateSettngs: (state, action) => {
      state.settings = {...state.settings, ...action.payload}
    },
    setCurrentDepartment: (state, action) => {
      state.currentDepartment = action.payload
    },
    setDepartments: (state, action) => {
      state.settings.departments = action.payload
    },
    updateDepartments: (state, action) => {
      state.settings.departments  = {...state.settings.departments, ...action.payload }
    },
    addDesignation: (state, action) => {
      state.settings.departments = action.payload
    },
    setCurrentDesignations: (state, action) => {
      state.currentDesignations = action.payload
    },
    updateCurrentDesignations: (state, action) => {
      state.currentDesignations = { ...state.currentDesignations, ...action.payload }
    },
  }
})

export const { setSettings, updateSettngs, setCurrentDepartment, setDepartments, updateDepartments, addDesignation, setCurrentDesignations, updateCurrentDesignations } = companySettingsSlice.actions
export default companySettingsSlice.reducer