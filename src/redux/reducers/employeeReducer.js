import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    employeeList: [],
    employee: {},
    currentEmployeeType:'',
    isDeleteDialogOpen: false,
    isUpdateDialogOpen: false,
    selectedUserId: '',
    error: ''
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
  }
})

export const { setEmployee, setEmployeeList, setCurrentEmployeeType, setError, isUpdateDialogOpen, isDeleteDialogOpen, selectedUserId  } = employeeSlice.actions
export default employeeSlice.reducer