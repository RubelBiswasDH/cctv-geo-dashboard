import { createSlice } from '@reduxjs/toolkit'

const initialState = {

  activityStatus: 'active',
  activityStatusOptions: ['active', 'non_active'],
  department: 'hr_and_admin',
  departmentOptions: ["hr_and_admin", "product_management", "tech_team", 'operations'],
  contractType: 'intern',
  contractTypeOptions: ['intern', 'permanent'],
  designation: 'designation',
  designationOptions: ['designation'],
  newUserName: '',
  newUserEmail: '',
  newUserMobile: '',
  newUserRole: 'GENERAL',
  newUserRoleOptions: ['GENERAL', 'ADMIN', 'HR'],
  fileInput: null,
  announcementMessage: '',
  userProfile: {},
  profileEdit: false,
  lateTime: '',
  workingDays: '',
  monthYear: '',
  companySettings: {
    companyAddressData: {},
    departments: {}
  },
  newUser: {
    user_level: 'GENERAL',
    profile: {

    }
  },
  userFieldError: {

  },
  companyAddressData: {

  },
  setSelectedUserId: '',
  userDeleteReason: '',
  addressFilterOptions: [],
  addUserDetails: false,
  fallbackComapanyAddress:''
}

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialState,
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
      state.newUserName = action.payload
    },
    setNewUserEmail: (state, action) => {
      state.newUserEmail = action.payload
    },
    setNewUserMobile: (state, action) => {
      state.newUserMobile = action.payload
    },
    setNewUserRole: (state, action) => {
      state.newUserRole = action.payload
    },
    setFileInput: (state, action) => {
      state.fileInput = action.payload
    },
    setAnnouncementMessage: (state, action) => {
      state.announcementMessage = action.payload
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload
    },
    updateUserProfile: (state, action) => {
      state.userProfile = { ...state.userProfile, ...action.payload }
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
      state.companySettings = { ...state.companySettings, ...action.payload }
    },
    updateCompanyDepartments: (state, action) => {
      state.companySettings.departments = { ...state.companySettings.departments, ...action.payload }
    },
    setNewUser: (state, action) => {
      state.newUser = action.payload
    },
    updateNewUser: (state, action) => {
      state.newUser = { ...state.newUser, ...action.payload }
    },
    updateNewUserProfile: (state, action) => {
      state.newUser.profile = { ...state.newUser.profile, ...action.payload }
    },
    setCompanyAddressData: (state, action) => {
      state.companyAddressData = action.payload
    },
    updateCompanyAddressData: (state, action) => {
      state.companyAddressData = { ...state.companyAddressData, ...action.payload }
    },
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload
    },
    setUserDeleteReason: (state, action) => {
      state.userDeleteReason = action.payload
    },
    setAddressFilterOptions: ( state, action ) => {
      state.addressFilterOptions = action.payload
    },
    setAddUserDetails: ( state, action ) => {
      state.addUserDetails = action.payload
    },
    setFallbackComapanyAddress: ( state, action ) => {
      state.fallbackComapanyAddress = action.payload
    },
    setUserFieldError: ( state, action ) => {
      state.userFieldError = action.payload
    },
    updateUserFieldError: (state, action) => {
      state.userFieldError = { ...state.userFieldError, ...action.payload }
    }
  }
})

export const { setActivityStatus, setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput, setAnnouncementMessage, setUserProfile, setProfileEdit, updateUserProfile, setLateTime, setMonthYear, setWorkingDays, setCompanySettings, updateCompanySettings, setNewUser, updateNewUser, updateNewUserProfile, setCompanyAddressData, setSelectedUserId, setUserDeleteReason, updateCompanyAddressData, updateCompanyDepartments, setAddressFilterOptions, setAddUserDetails, setFallbackComapanyAddress, setUserFieldError, updateUserFieldError } = adminSlice.actions
export default adminSlice.reducer