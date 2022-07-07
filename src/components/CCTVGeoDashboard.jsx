import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// Import Components
import { Box, Paper, Typography } from '@mui/material'
import NavBar from './NavBar'
import LeftNav from './LeftNav'
import RightNav from './RightNav'
import MapGL from './common/MapGL'
import * as turf from '@turf/turf'
import { setCurrentAddress, setSelectedPointData } from '../redux/reducers/cctvGeoReducer'

class CCTVGeoDashboard extends React.PureComponent {
  state = {
  }
  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setCurrentAddress(null))
  }
  
  _getDistance = (point) => {
    const { currentAddress } = this.props
    if(currentAddress && Object.keys(currentAddress).length){
      const latitude = currentAddress?.latitude
      const longitude =  currentAddress?.longitude

      const from = turf.point([longitude, latitude]);
      const options = {units: 'kilometers'};
      const to = turf.point(point);
      const distance = turf.distance(from, to, options);
      return distance
  }
  return 0
}
  _getMarkerData = (data) => {
    if (data && data.length){
      const { currentAddress } = this.props
  
      let markerData = []
      if(currentAddress && Object.keys(currentAddress).length){
          data.forEach( d => {
            if(d && Object.keys(d).length){
              const distance = this._getDistance([d?.longitude, d?.latitude])
              if(distance <= .5 ){
              markerData = [
                ...markerData,
                {
                ...d,
                exact_address : d?.Address,
                longitude: d?.longitude,
                latitude: d?.latitude,
                isCctv: d?.subType?.includes('CCTV Camera') ?? false
                }
              ]
            }
            }
          })
          return markerData
      }

      data.forEach( d => {
        if(d && Object.keys(d).length){
          markerData = [
            ...markerData,
            {
            ...d,
            exact_address : d?.Address,
            longitude: d?.longitude,
            latitude: d?.latitude,
            isCctv: d?.subType?.includes('CCTV Camera') ?? false
            }
          ]
        }
      })
      return markerData
  }
  else {
    return []
  }
}

  _getGeoJsonData = () => {
    const { thanaGeo, districtGeo, filterFields } = this.props
    const geoJson = {
        "type": "FeatureCollection",
        "features": [],
    }
    //thana area polygon
    if(thanaGeo && thanaGeo?.length && filterFields && filterFields?.thana && filterFields?.thana !== 'All'){
      thanaGeo.forEach((t,i) => {
          if(t?.thana === filterFields.thana){
          geoJson.features.push({
              "type": "Feature",
              "geometry": t?.geom,
              "properties": {
                'opacity':.1,
                'lineWidth':1
              }
          })
      }
    })
    }
    else if((districtGeo && districtGeo?.length && filterFields && filterFields?.district)){
      districtGeo.forEach((d,i) => {
        if(d?.district === filterFields.district){
        geoJson.features.push({
            "type": "Feature",
            "geometry": d?.geom,
            "properties": {
              'opacity':.1,
              'lineWidth':1
            }
        })
    }
  })
    }
     if((districtGeo && districtGeo?.length && filterFields && filterFields?.district && filterFields?.district === "All")){
      districtGeo.forEach((d,i) => {
        geoJson.features.push({
            "type": "Feature",
            "geometry": d?.geom,
            "properties": {
              'opacity':.1,
              'lineWidth':1
            }
        })

  })
    }
    return geoJson;
  }

  _handleMarkerClick = (data) => {
    const { dispatch } = this.props
    if(data) {
      setTimeout(() => {
        dispatch(setSelectedPointData(data))
      }, 100)
    }
  }
  _handleClearSelectedData = () => {
    const { dispatch } = this.props
    dispatch(setSelectedPointData({}))
  }

  render() {
    const { _getMarkerData, _getGeoJsonData, _handleMarkerClick, _handleClearSelectedData } = this
    const { isLeftNavOpen, isRightNavOpen, filteredCctvData, currentAddress, selectedPointData } = this.props
    const markerData = _getMarkerData([ ...filteredCctvData, currentAddress])
    const geoJsonData = _getGeoJsonData()
    return (
      <Box sx={{display:'flex', boxSizing:"border-box",height:'100%', width:'100%'}}>
        <LeftNav />
        <Box  
          sx={{ 
            width: (isLeftNavOpen && isRightNavOpen) ? `calc(100% - ${ 600 }px)`: (isLeftNavOpen || isRightNavOpen) ? `calc(100% - ${ 300 }px)` : '100%',
            marginLeft: isLeftNavOpen ?  '300px' : 0,
            marginRight: isRightNavOpen ?  '300px' : 0, 
            boxSizing:'border-box',
            height:'100%'
            }}>
          <NavBar />
          <Box sx={{ ...containerStyles,boxSizing:'border-box',m:0,p:0, height:`calc(100% - ${ 50 }px)`}}>
            <Box sx={{width:'100%',height:'100%',p:0,m:0,display:'flex'}}>
              <Box sx={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    boxSizing:'border-box',
                    width: '70%',
                    height:'100%',
                    p:2,
                  }}>
                <MapGL
                      markerData={ markerData }
                      geojsonData={ geoJsonData }
                      handleMarkerClick={ _handleMarkerClick }
                      _handleClearSelectedData={ _handleClearSelectedData }
                  />
              </Box>

            <Box sx={{width:'30%',height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-start',p:2,pl:0,boxSizing:'border-box'}}>

                <Paper elevation={1} sx={{height:"100%", width:'100%'}}>
                { selectedPointData?.Address && <>
                  <Box sx={{width:'100%', display:'flex',justifyContent:'center',py:2}}>
                    <Typography variant='h6' sx={{textAlign:'center'}}>Details</Typography>
                  </Box>
                    {Object.keys(selectedPointData)
                      .filter( d => expectedFields.includes(d))
                      .map( d => (<InfoRows key={d} title={`${d}: `} value={selectedPointData[d]}/>))}
                  </>
                  }
                </Paper>
            </Box>
            </Box>
          </Box>
        </Box>
        <RightNav/>
      </Box>
    )
  }
}

const InfoRows = (props) => {
  const { title, value} = props
  if (!value || !title || value?.length <= 0 || title?.length <=0 ){
    return <></>
  }
  return(
      <Box key={ title } sx={{display:'flex',width:'100%',px:2, boxSizing:'border-box'}}>
        <Box sx={{width:'40%'}}>
            <Typography sx={{fontWeight:600}}>{title.replaceAll('number_of','no_of').toUpperCase().replaceAll("_"," ")}</Typography>
        </Box>
        <Box sx={{width:'60%',pl:.5}}>
            <Typography>{value}</Typography>
        </Box>
    </Box>
  )
}
const expectedFields = [
  'place_name',
  'Address', 
  'holding_number', 
  'number_of_gates',
  'number_of_floors',
  'number_of_apartments',
  'postCode', 
  'area', 
  'city', 
  'district',
  'sub_district', 
  'thana', 
  'pType', 
  'subType'
]
// Styles
const containerStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  p:0,
  m:0
}

// Prop Types
CCTVGeoDashboard.propTypes = {
  isLeftNavOpen: PropTypes.bool,
  dispatch: PropTypes.func
}

CCTVGeoDashboard.defaultProps = {
  isLeftNavOpen: false,
  dispatch: () => null
}

const mapStateToProps = state => ({
  isLeftNavOpen: state?.cctvGeo?.isLeftNavOpen ?? true,
  isRightNavOpen: state?.cctvGeo?.isRightNavOpen ?? false,
  cctvData: state?.cctvGeo?.cctvData ?? [],
  filteredCctvData: state?.cctvGeo?.filteredCctvData ?? [],
  filterFields: state?.cctvGeo?.filterFields ?? {},
  selectedDataId: state?.cctvGeo?.selectedDataId ?? -1,
  selectedPointData: state?.cctvGeo?.selectedPointData ?? null,
  thanaGeo: state?.cctvGeo?.thanaGeo ?? {},
  districtGeo: state?.cctvGeo?.districtGeo ?? {},
  currentAddress: state?.cctvGeo?.currentAddress ?? {}
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CCTVGeoDashboard)