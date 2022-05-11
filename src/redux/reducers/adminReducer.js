import { createSlice } from '@reduxjs/toolkit'

const initialState = {

  activityStatus: 'active',
  activityStatusOptions:['active','non_active'],
  department: 'hr_and_admin',
  departmentOptions: ["hr_and_admin","product_management", "tech_team", 'operations'],
  contractType: 'intern',
  contractTypeOptions:['intern','permanent'],
  designation: 'designation',
  designationOptions: ['designation'],

}

const adminSlice = createSlice({
  name: 'admin',
  initialState:initialState,
  reducers: {

    setActivityStatus: (state, action) => {
      state.activityStatus = action.payload
    },
    setDepartment: (state, action) => {
      state.department = action.payload
    },

    setContractType: (state, action) => {
      state.contractType = action.payload
    },
    setdesignation: (state, action) => {
      state.designation = action.payload
    },

  }
})

export const { setActivityStatus,setDepartment, setContractType, setdesignation } = adminSlice.actions
export default adminSlice.reducer