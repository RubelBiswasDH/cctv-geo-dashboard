import { createSlice } from '@reduxjs/toolkit'

const initialState = {

  activityStatus: 'active',
  activityStatusOptions:['active','non_active'],
  department: 'hr_and_admin',
  departmentOptions: ["hr_and_admin","product_management", "tech_team", 'operations'],
  

}

const adminSlice = createSlice({
  name: 'admin',
  initialState:initialState,
  reducers: {

    setActivityStatus: (state, action) => {
      state.activityStatus = action.payload
    }

  }
})

export const { setActivityStatus } = adminSlice.actions
export default adminSlice.reducer