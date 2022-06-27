import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _isEqual from 'fast-deep-equal'
import _debounce from 'lodash.debounce'
import { Map, NavigationControl, Popup, Marker } from 'bkoi-gl'
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import { bbox } from '@turf/turf'
import { MAP } from '../../App.config'
import { setCompanySettings } from '../../redux/reducers/adminReducer'
// Import Styles
import 'mapbox-gl-style-switcher/styles.css'

// Import Actions
import { getReverseGeoAddress } from '../../utils/utils'

class MapGL extends React.PureComponent {
  state = {
    container: 'map-' + Math.floor(Math.random() * 1000),
    center: [ 90.3938010872331, 23.821600277500405 ],
    zoom: 9,
    map: null,
    renderedMarkers: []
  }

  componentDidMount() {
    // Create Map Instance
    this._createMap()
  }

  componentDidUpdate(prevProps, prevState) {
    const { markerData } = this.props
    const { map } = this.state

    // If map changes in state
    if(prevState.map !== map  && map) {
      // Render Markers
      this._renderMarkers(markerData)
    }

    // If Marker Data Changes
    if(!_isEqual(prevProps.markerData, markerData)) {
      // Render Markers
      this._renderMarkers(markerData)
    }
  }

  componentWillUnmount() {
    // Destroy Map Instance
    this._destroyMap()
  }

  // Create Map
  _createMap = () => {
    const { container, center, zoom } = this.state

    const map = new Map({
      container,
      center,
      zoom,
      accessToken: MAP.ACCESS_TOKEN,
      attributionControl: false,
      style: MAP.STYLES[0].uri
    })

    // Add Controls
    map.addControl(new NavigationControl(), 'top-left')
    map.addControl(new MapboxStyleSwitcherControl(MAP.STYLES, 'Bangla'), 'top-right')

    // Map Resize Event
    this._handleMapResize(map)

    // Disable Double Click Zoom
    map.doubleClickZoom.disable()
    // get Current Location
    map.on('click', e => {
      const {lngLat} = e
      getReverseGeoAddress({ longitude: lngLat.lng, latitude: lngLat.lat })
      .then(res => {
        const reverseData = res.place
        if(reverseData) {
          // Get Updated Address from Reverse Geo Code
          const updatedAddress = {
            exact_address: reverseData.address,
            longitude: lngLat.lng,
            latitude: lngLat.lat 
          }
          this.props.dispatch(setCompanySettings({...this.props.companySettings, ...{companyAddressData:updatedAddress}}))
        }
      })
      .catch(err => {
        console.error(err)
      })
  
      //end
      })
    this.setState({ map })
  }

  // Destroy Map
  _destroyMap = () => {
    const { map } = this.state

    // Remove Map Instance
    if(map) {
      map.remove()
      this.setState({ map: null, renderedMarkers: [] })
    }
  }

  // Render Markers
  _renderMarkers = (markerData, options={ fitBounds: true }) => {
    const { map } = this.state

    // Remove Existing Markers
    this._removeMarkers()

    if(!markerData || markerData.length <= 0) {
      return
    }

    // Create Markers
    const renderedMarkers = []
    markerData.forEach(m => {
      const marker = this._createMarker(m)
      if(marker && marker.marker) {
        marker.marker.addTo(map)

        // Show Popup Initially
        marker.marker._popup.addTo(map)
        renderedMarkers.push(marker)
      }
    })

    // Fit Map Bounds
    if(options.fitBounds) {
      this._fitBounds(markerData)
    }
    this.setState({ renderedMarkers })
  }

  // Remove Markers
  _removeMarkers = () => {
    const { renderedMarkers } = this.state

    if(!renderedMarkers || renderedMarkers.length <= 0) {
      return
    }

    renderedMarkers.forEach(m => {
      if(m && m.marker) {
        m.marker.remove()
      }
    })

    this.setState({ renderedMarkers: [] })
  }

  // Create marker instance
  _createMarker = data => {
    const { defaultMarker } = this.props

    if(!data) {
      return null
    }

    if(data.longitude === null || data.longitude === undefined || data.longitude === '' || data.latitude === null || data.latitude === undefined || data.latitude === '') {
      return null
    }

    const lngLat = [ data.longitude, data.latitude ]

    // Create Popup
    const popup = new Popup({ focusAfterOpen: false, maxWidth: '360px' })
      .setText(data.exact_address)

    // Add Marker
    const marker = new Marker({ draggable: data.is_exact_address === 0, color: data.is_exact_address === 0 ? '#ff0000' : '' })
      .setLngLat(lngLat)
      .setPopup(defaultMarker ? null : popup)
    
    // Handle maker drag
    marker.on('dragend', this._handleMarkerDragEnd)

    return { marker, data }
  }

  // On Marker Dragend
  _handleMarkerDragEnd = (marker) => {
    const { getUpdatedAddress } = this.props

    // Get Latitude and Longitude from Marker
    const lngLat = marker.target.getLngLat()

    // Get Address from Latitude and Longitude using Reverse Geo Code
    getReverseGeoAddress({ longitude: lngLat.lng, latitude: lngLat.lat })
      .then(res => {
        const reverseData = res.place
        if(reverseData) {
          // Get Updated Address from Reverse Geo Code
          const updatedAddress = { exact_address: reverseData.address, longitude: lngLat.lng, latitude: lngLat.lat }

          // Update Address
          getUpdatedAddress(updatedAddress)
          return 
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  // Fit Bounds
  _fitBounds = markerData => {
    const { map } = this.state
    let ifFitBounds = true

    // To GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: markerData.map(d => {
        if(d.recentOperation) {
          ifFitBounds = false
        }

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [ d.longitude, d.latitude ]
          }
        }
      })
    }

    // Fit Bounds
    if(ifFitBounds) {
      // Bounding Box
      const _bbox = bbox(geoJson)

      map.fitBounds(_bbox, { padding: 64, maxZoom: 18, animate: false })
    }
  }

  // Handle Map Resize
  _handleMapResize = map => {
    const { container } = this.state

    // Add Event Listeners
    const mapContainerElement = document.getElementById(container)
    if(mapContainerElement) {
      new ResizeObserver(_debounce(() => {
        if(map) {
          map.resize()
        }
      }, 10)).observe(mapContainerElement)
    }
  }

  render() {
    const { container } = this.state

    return (
      <div id={ container } style={ containerStyles } />
    )
  }
}

// JSS Styles
const containerStyles = {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  minHeight: '400px',
  overflow: 'hidden',
  border: '1px solid #dcdcdc',
  borderRadius: '4px'
}

// Prop Types
MapGL.propTypes = {
  markerData: PropTypes.array,
  defaultMarker: PropTypes.bool
}

MapGL.defaultProps = {
  markerData: [],
  defaultMarker: false
}

// export default MapGL
const mapStateToProps = state => ({
  companySettings: state?.admin?.companySettings,
})

const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(MapGL)