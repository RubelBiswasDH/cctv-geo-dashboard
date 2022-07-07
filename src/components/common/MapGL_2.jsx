import React from 'react'
import PropTypes from 'prop-types'
import _isEqual from 'fast-deep-equal'
import _debounce from 'lodash.debounce'
import { Map, NavigationControl, Popup, Marker, FullscreenControl } from 'bkoi-gl'
// import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import { bbox } from '@turf/turf'


// Import Styles
import 'mapbox-gl-style-switcher/styles.css'

// Import Types
import { BASE_URL, MAP } from '../../App.config'

class MapGL extends React.PureComponent {
  state = {
    container: 'map-' + Math.floor(Math.random() * 1000),
    center: [ 90.3938010872331, 23.821600277500405 ],
    zoom: 9,
    map: null,
    renderedMarkers: [],
    geojsonSourceId: 'geojson-source',
    geojsonLayerId: 'geojson-layer',
    renderedGeojson: null
  }

  componentDidMount() {
    // Create Map Instance
    this._createMap()
  }

  componentDidUpdate(prevProps, prevState) {
    const { geojsonData, markerData } = this.props
    console.log({markerData})
    const { map } = this.state
    // console.log({markerData})

    // If map changes in state
    if(prevState.map !== map) {      
      // Render Geojson Layer
      this._renderGeojsonOnLoad(geojsonData)

      // Render Markers
      this._renderMarkers(markerData)
    }

    // If Geojson Data Changes
    if (!_isEqual(prevProps.geojsonData, geojsonData)) {      
      // Render Geojson Layer
      this._renderGeojson(geojsonData, { fitBounds: !prevProps.geojsonData && geojsonData })
    }

    // If Marker Data Changes
    if (!_isEqual(prevProps.markerData, markerData)) {      
      // Render Markers
      this._renderMarkers(markerData, { fitBounds: !prevProps.markerData?.length && markerData.length })
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
      style: MAP.STYLES[1].uri,
      accessToken: MAP.ACCESS_TOKEN,
      attributionControl: false
    })

    // Map Resize Event
    this._handleMapResize(map)

    // Disable Double Click Zoom
    map.doubleClickZoom.disable()

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
        // marker.marker._popup.addTo(map)

        // use GetElement to get HTML Element from marker and add event

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

    if(!data) {
      return null
    }

    if(data.longitude === null || data.longitude === undefined || data.longitude === '' || data.latitude === null || data.latitude === undefined || data.latitude === '') {
      return null
    }           

    const temp = this._generateMarker(data)
    return temp

    // const customPopup = this._createCustomPopup(data)
    
    // // Create Popup
    // const popup = new Popup({ focusAfterOpen: false, maxWidth: '260px' })      
    //   .setDOMContent( customPopup )

    // // Add Marker
    // const marker = new Marker(data.is_active === 0 ? greenCarMarker : data.is_active === 1 ? redCarMarker : '')
    //   .setLngLat(lngLat)
    //   .setPopup(defaultMarker ? null : popup)
    
    // return { marker, data }
  }

  // Create marker
  _generateMarker = (data) => {    
    const { defaultMarker } = this.props 

    const lngLat = [ data.longitude, data.latitude ]    
    // Create Hub Marker
    const hubMarker = document.createElement('div')
    hubMarker.className = 'orangeHomeMarker'
    // hubMarker.innerText = '1'
      // Create Green Package Marker
    const greenPackageMarker = document.createElement('div')
    greenPackageMarker.className = 'greenPackageMarker'
    const whitePackageMarker = document.createElement('div')
    whitePackageMarker.className = 'whitePackageMarker'
    const yellowPackageMarker = document.createElement('div')
    yellowPackageMarker.className = 'yellowPackageMarker'
    if(data?.index){
      yellowPackageMarker.innerText = ''+data?.index
    }
    // Create Green Marker
    const greenCarMarker = document.createElement('div')
    greenCarMarker.className = 'greenCarMarker'

    // Create Red Marker
    const redCarMarker = document.createElement('div')
    redCarMarker.className = 'redCarMarker' 

    // Create Green Marker
    const orangeCarMarker = document.createElement('div')
    orangeCarMarker.className = 'orangeCarMarker'

    // Create Red Marker
    const greyCarMarker = document.createElement('div')
    greyCarMarker.className = 'greyCarMarker'  

    const customPopup = this._createCustomPopup(data)

    // Create Popup
    const popup = new Popup({ focusAfterOpen: false, maxWidth: '260px' })      
      .setDOMContent( customPopup )

    // Add Marker
    const marker = new Marker(
      data?.field_force_status === 'ONLINE' && data?.user_type === 'FIELD_FORCE' ? greenCarMarker : 
      data?.field_force_status === 'OFFLINE' && data?.user_type === 'FIELD_FORCE' ? greyCarMarker : 
      data?.field_force_status === 'ONGOING' && data?.user_type === 'FIELD_FORCE' ? redCarMarker : 
      data?.field_force_status === 'ASSIGNED' && data?.user_type === 'FIELD_FORCE' ? orangeCarMarker :
      data?.location_type === 'hub' ? hubMarker:
      data?.vehicle_type === 'TRUCK' ? redCarMarker:
      data?.vehicle_type === 'TWO WHEELER' ? greenCarMarker:
      data?.vehicle_type === 'MINI TRUCK' ? greenCarMarker:   
      data?.isPkg === true ? yellowPackageMarker:    
      data?.user_type === 'FIELD_FORCE' ? greyCarMarker : null
    )
      .setLngLat(lngLat)
      .setPopup(defaultMarker ? null : popup)

    return { marker, data }
  }

  // Create Custom Popup
  _createCustomPopup = (data) => {  
   
    const tempEl = document.createElement('div')    
    
    const nameText = document.createTextNode(`${data.exact_address ? data.exact_address : data.ff_user_name ? data.ff_user_name : ''}`)
    const updatedTimeText = document.createTextNode(`${data.updated_at ? data.updated_at : ''}`)
    const vehicleId = document.createTextNode(`${data.user_id ? data.user_id : ''}`)
    const nameEl = document.createElement('div')
    nameEl.style.display = 'flex'

    const userIdEl = document.createElement('div')
    userIdEl.style.display = 'flex'
    const userIdTitle = document.createTextNode('User : ')
    userIdEl.appendChild(userIdTitle)

    const nameTitleEl = document.createElement('p')
    nameTitleEl.setAttribute('class', 'customPopupTitle')
    const nameTitle = document.createTextNode('Name: ')
    nameTitleEl.appendChild(nameTitle)

    nameEl.appendChild(nameTitleEl)
    nameEl.appendChild(nameText)
    userIdEl.appendChild(vehicleId)

    const updatedTimeEl = document.createElement('div')
    updatedTimeEl.style.display = 'flex'

    const updateTimeTitleEl = document.createElement('p')
    updateTimeTitleEl.setAttribute('class', 'customPopupTitle')
    const updateTimeTitle = document.createTextNode('Updated at: ')
    updateTimeTitleEl.appendChild(updateTimeTitle)

    updatedTimeEl.appendChild(updateTimeTitleEl)
    updatedTimeEl.appendChild(updatedTimeText)

    const areaEl = document.createElement('div')
    areaEl.style.display = 'flex'

    if(data.address) {      
      const areaText = document.createTextNode(`${data.address ?? ''}`)      

      const areaTitleEl = document.createElement('p')
      areaTitleEl.setAttribute('class', 'customPopupTitle')
      const areaTitle = document.createTextNode('Area: ')
      areaTitleEl.appendChild(areaTitle)

      areaEl.appendChild(areaTitleEl)
      areaEl.appendChild(areaText)
    }
    if(data.vehicle_type){
      tempEl.appendChild(userIdEl)
    }
    tempEl.setAttribute('id', 'custom-popup')
    tempEl.appendChild(nameEl)
    tempEl.appendChild(updatedTimeEl)
    tempEl.appendChild(areaEl)
    return tempEl
  }

  // Fit Bounds
  _fitBounds = (data, options={ dataType: 'row-object' }) => {
    const { map } = this.state
    let ifFitBounds = true

    let geoJson = null
    if(options?.dataType === 'geojson') {
      geoJson = data

    } else {
      // To GeoJSON
      geoJson = {
        type: 'FeatureCollection',
        features: data.map(d => {
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

  // Render Geojson
  _renderGeojson = (geojsonData, options={ fitBounds: true }) => {    
    const { map, geojsonSourceId, geojsonLayerId } = this.state

    // Remove Existing Geojson
    this._removeGeojson()

    if(!geojsonData?.features?.length) {
      return
    }

    geojsonData.features.forEach((f, i) => {
      // Add Geojson Source To Map
      map.addSource(`${ geojsonSourceId }-${ i }`, {
        type: 'geojson',
        data: f
      })

      if(f?.geometry?.type === 'LineString') {
        // Add LineString
        map.addLayer({
          'id': `${ geojsonLayerId }-${ i }`,
          'type': 'line',
          'source': `${ geojsonSourceId }-${ i }`,
          'layout': {
            'visibility': 'visible',
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': f?.properties?.lineColor ?? '#008000',
            'line-width': f?.properties?.lineWidth ?? 4
          },
          'filter': [ '==', '$type', 'LineString' ]
        })
      }

      if(f?.geometry?.type === 'Polygon') {
          // Add Polygon Layer
        map.addLayer({
            'id': `${ geojsonLayerId }-${ i }`,
            'type': 'fill',
            'source': `${ geojsonSourceId }-${ i }`,
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': f?.properties?.fillColor ?? '#0080ff',
                'fill-opacity': f?.properties?.opacity ?? 0.1
            },
            'filter': [ '==', '$type', 'Polygon' ]
        })

        // Add Polygon Outline Layer
        map.addLayer({
            'id': `${ geojsonLayerId }-${ i }-outline`,
            'type': 'line',
            'source': `${ geojsonSourceId }-${ i }`,
            'layout': {
                'visibility': 'visible',
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': f?.properties?.lineColor ?? '#008000',
                'line-width': f?.properties?.lineWidth ?? 2
            }
        })
      }
    })

    // Fit Map Bounds
    if(options.fitBounds) {
      this._fitBounds(geojsonData, { dataType: 'geojson' })
    }

    this.setState({ renderedGeojson: geojsonData })
  }

  // Render GeoJSON without map on load
  _renderGeojsonOnLoad = (geojsonData, options={ fitBounds: true }) => {    
    const { map, geojsonSourceId, geojsonLayerId } = this.state
    
    // Remove Existing Geojson
    this._removeGeojson()

    if(!geojsonData?.features?.length) {
      return
    }

    map.on('load', () => {
      geojsonData?.features.forEach((f, i) => {
        // Add Geojson Source To Map
        map.addSource(`${ geojsonSourceId }-${ i }`, {
          type: 'geojson',
          data: f
        })

        if(f?.geometry?.type === 'LineString') {
          // Add LineString Layer
          map.addLayer({
            'id': `${ geojsonLayerId }-${ i }`,
            'type': 'line',
            'source': `${ geojsonSourceId }-${ i }`,
            'layout': {
              'visibility': 'visible',
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': f?.properties?.lineColor ?? '#008000',
              'line-width': f?.properties?.lineWidth ?? 4
            },
            'filter': [ '==', '$type', 'LineString' ]
          })
        }

        if(f?.geometry?.type === 'Polygon') {
            // Add Polygon Layer
          map.addLayer({
              'id': `${ geojsonLayerId }-${ i }`,
              'type': 'fill',
              'source': `${ geojsonSourceId }-${ i }`,
              'layout': {
                  'visibility': 'visible'
              },
              'paint': {
                  'fill-color': f?.properties?.fillColor ?? '#3A0E89',
                  'fill-opacity': f?.properties?.opacity ?? 0.1
              },
              'filter': [ '==', '$type', 'Polygon' ]
          })
  
          // Add Polygon Outline Layer
          map.addLayer({
              'id': `${ geojsonLayerId }-${ i }-outline`,
              'type': 'line',
              'source': `${ geojsonSourceId }-${ i }`,
              'layout': {
                  'visibility': 'visible',
                  'line-join': 'round',
                  'line-cap': 'round'
              },
              'paint': {
                  'line-color': f?.properties?.lineColor ?? '#008000',
                  'line-width': f?.properties?.lineWidth ?? 2
              }
          })
        }
      })     

      // Fit Map Bounds
      if(options.fitBounds) {
        this._fitBounds(geojsonData, { dataType: 'geojson' })
      }
    })

    this.setState({ renderedGeojson: geojsonData })
}

  // Remove Geojson
  _removeGeojson = () => {
    const { map, geojsonSourceId, geojsonLayerId, renderedGeojson } = this.state

    if(!renderedGeojson) {      
      return
    }    

    // Remove Geojson Layer
    renderedGeojson.features.forEach((f, i) => {
      if(map.getLayer(`${ geojsonLayerId }-${ i }`)) {      
        map.removeLayer(`${ geojsonLayerId }-${ i }`)
      }

      if(map.getLayer(`${ geojsonLayerId }-${ i }-outline`)) {      
        map.removeLayer(`${ geojsonLayerId }-${ i }-outline`)
      }
    })

    // Remove Geojson Source
    renderedGeojson.features.forEach((f, i) => {
      if(map.getSource(`${ geojsonSourceId }-${ i }`)) {      
        map.removeSource(`${ geojsonSourceId }-${ i }`)
      }
    })

    this.setState({ renderedGeojson: null })
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
  borderRadius: '4px',
  flex: 1
}

// Prop Types
MapGL.propTypes = {
  geojsonData: PropTypes.object,
  markerData: PropTypes.array,
  defaultMarker: PropTypes.bool
}

MapGL.defaultProps = {
  geojsonData: null,
  markerData: [],
  defaultMarker: false
}

export default MapGL