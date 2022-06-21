import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    employeeList: [],
    employee: {},
    currentEmployeeType:'',
    isDeleteDialogOpen: false,
    isUpdateDialogOpen: false,
    selectedUserId: '',
    currentProfileTab:'',
    error: '',
    profile: {},
}

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployee: (state, action) => {
      state.employee = action.payload
    },
    setEmployeeList: (state, action) => {
          state.employeeList = action.payload
        },
    setError: (state, action) => {
      state.error = action.payload
    },
    setCurrentEmployeeType: ( state, action ) => {
      state.currentEmployeeType = action.payload
    },
    setIsDeleteDialogOpen: ( state, action ) => {
      state.isDeleteDialogOpen = action.payload
    },
    setIsUpdateDialogOpen: ( state, action ) => {
      state.isDeleteDialogOpen = action.payload
    },
    setSelectedUserId: ( state, action ) => {
      state.isUpdateDialogOpen = action.payload
    },
    setCurrentProfileTab: ( state, action ) => {
      state.currentProfileTab = action.payload
    },
    setEmployeeProfile: ( state, action) => {
      state.profile = action.payload
    },
    updateEmployeeProfile: ( state, action) => {
      state.profile = { ...state.profile, ...action.payload}
    },
  }
})

export const { setEmployee, setEmployeeList, setCurrentEmployeeType, setError, isUpdateDialogOpen, isDeleteDialogOpen, selectedUserId, setCurrentProfileTab, setEmployeeProfile, updateEmployeeProfile } = employeeSlice.actions
export default employeeSlice.reducer