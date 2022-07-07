import { createSlice } from '@reduxjs/toolkit'
import json_districts from "../../data/districts.json"
import json_thanas from "../../data/thanas.json"
import cctv_data from "../../data/cctv_data.json"
import thana_geo from "../../data/thana_geo.json"
import district_geo from "../../data/district_geo.json"

const initialState = {
    isLeftNavOpen: true,
    isRightNavOpen: false,
    toastIsOpen: false,
    toastMessage: '',
    toastSeverity: 'success',
    filterFields: {
      district: "Dhaka",
      thana: "All"
    },
    districts: json_districts?.districts ?? [],
    thanas: json_thanas?.thanas ?? [],
    cctvData: cctv_data?.cctv_data ?? [],
    thanaGeo: thana_geo?.thana_geo ?? [],
    districtGeo: district_geo?.district_geo ?? [],
    filteredCctvData: [],
    selectedDataId: -1,
    selectedPointData: null,
    addressOptions: [],
    currentAddress: null
}

const plsSlice = createSlice({
  name: 'cctvGeo',
  initialState,
  reducers: {
    setIsLeftNavOpen: (state, action) => {
      state.isLeftNavOpen = action.payload
    },
    setIsRightNavOpen: (state, action) => {
      state.isRightNavOpen = action.payload
    },
    setToastIsOpen: (state, action) => {
      state.toastIsOpen = action.payload
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload
    },
    setToastSeverity: (state, action) => {
      state.toastSeverity = action.payload
    },
    setFilterFields: ( state, action ) => {
      state.filterFields = action.payload
    },
    updateFilterFields: ( state, action ) => {
      state.filterFields = { ...state.filterFields, ...action.payload}
    },
    setFilteredCctvData: (state, action) => {
      state.filteredCctvData = action.payload
    },
    setSelectedDataId: (state, action) => {
      state.selectedDataId = action.payload
    },
    setSelectedPointData: (state, action) => {
      state.selectedPointData = action.payload
    },
    setAddressOptions:  (state, action) => {
      state.addressOptions = action.payload
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
    }
  }
})

export const { setIsLeftNavOpen, setIsRightNavOpen, setToastIsOpen, setToastMessage, setToastSeverity, setFilterFields,  updateFilterFields, cctvData, setFilteredCctvData, setSelectedDataId, setSelectedPointData, setAddressOptions, setCurrentAddress } = plsSlice.actions
export default plsSlice.reducer