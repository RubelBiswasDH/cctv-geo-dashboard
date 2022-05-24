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
  newUserName: '',
  newUserEmail:'',
  newUserMobile:'',
  newUserRole:'GENERAL',
  newUserRoleOptions:['GENERAL', 'ADMIN', 'HR'],
  fileInput:null,
  announcementMessage: '',
  userProfile: {},
  profileEdit: false,
  lateTime: '',
  workingDays: '',
  monthYear: '',
  companySettings: {},
  newUser: {
    profile:{

    }
  },
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
    setNewUserName: (state, action) => {
      // console.log('payload: ',action.payload)
      state.newUserName = action.payload
    },
    setNewUserEmail: (state, action) => {
      // console.log('payload: ',action.payload)
      state.newUserEmail = action.payload
    },
    setNewUserMobile: (state, action) => {
      // console.log('payload: ',action.payload)
      state.newUserMobile = action.payload
    },
    setNewUserRole: (state, action) => {
      // console.log('payload: ',action.payload)
      state.newUserRole = action.payload
    },

    setFileInput: (state, action) => {
      //console.log('file payload ',action.payload)
      state.fileInput = action.payload
    },
    setAnnouncementMessage: (state, action) => {
      state.announcementMessage = action.payload
    },
    setUserProfile: (state, action) => {
      // console.log("admin : ",action, action.payload)
        state.userProfile = action.payload
      },
    updateUserProfile: (state, action) => {
      // console.log("admin : ",action, action.payload)
        state.userProfile = {...state.userProfile, ...action.payload}
      },
    setProfileEdit: (state, action) => {
        state.profileEdit = action.payload
      },
    setLateTime: (state, action) => {
      state.lateTime = action.payload
    },
    setMonthYear: (state, action) => {
      state.monthYear = action.payload
    },
    setWorkingDays: (state, action) => {
      state.workingDays = action.payload
    },
    setCompanySettings: (state, action) => {
      state.companySettings = action.payload
    },
    updateCompanySettings: (state, action) => {
    // console.log("admin : ",action, action.payload)
      state.companySettings = {...state.companySettings, ...action.payload}
    },
    setNewUser: (state, action) => {
      // console.log("admin : ",action, action.payload)
        state.newUser = action.payload
      },
    updateNewUser: (state, action) => {
      // console.log("admin : ",action, action.payload)
        state.newUser = {...state.newUser, ...action.payload}
      },
    updateNewUserProfile: (state, action) => {
      // console.log("admin : ",action, action.payload)
        state.newUser.profile = {...state.newUser.profile, ...action.payload}
      },
  }
})

export const { setActivityStatus,setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput,setAnnouncementMessage,setUserProfile, setProfileEdit, updateUserProfile, setLateTime, setMonthYear, setWorkingDays, setCompanySettings, updateCompanySettings, setNewUser, updateNewUser, updateNewUserProfile } = adminSlice.actions
export default adminSlice.reducer