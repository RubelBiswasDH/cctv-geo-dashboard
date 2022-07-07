import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _isEqual from 'fast-deep-equal'
import _debounce from 'lodash.debounce'
import { Map, NavigationControl, Popup, Marker } from 'bkoi-gl'
import { bbox } from '@turf/turf'
import { MAP } from '../../App.config'

// Import Styles


// Import Assets
import cctvIcon from '../../assets/icons/cctv-camera.png'

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
    const { markerData, geojsonData } = this.props
    const { map } = this.state
    
    // If map changes in state
    if(prevState.map !== map) {      
      // Render Geojson Layer
      this._renderGeojsonOnLoad(geojsonData)
      // Render Markers
      // this._renderMarkers(markerData)
      this._renderMarkersOnLoad((markerData))
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
      accessToken: MAP.ACCESS_TOKEN,
      attributionControl: false,
      style: MAP.STYLES[1].uri
    })

    // Add Controls
    map.addControl(new NavigationControl(), 'top-left')
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
        renderedMarkers.push(marker)
      }
    })

    // Fit Map Bounds
    if(options.fitBounds) {
      this._fitBounds(markerData)
    }
    this.setState({ renderedMarkers })
  }

  //startblock

  _renderMarkersOnLoad = (markerData) => {
    const { map } = this.state

    // Remove Existing Markers


    if(!markerData || markerData.length <= 0) {
      return
    }
    this._removeMarkers()
    // Create Markers
    const renderedMarkers = []
    map.on('load', () => {
      markerData.forEach(m => {
        const marker = this._createMarker(m)
        if(marker && marker.marker) { 
          marker.marker.addTo(map)
          renderedMarkers.push(marker)
        }
      })
    })

    this.setState({ renderedMarkers })
  }

  //endblock

  // Remove Markers
  _removeMarkers = () => {
    const { map, renderedMarkers } = this.state
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
    const { map } = this.state
    const { defaultMarker, handleMarkerClick, _handleClearSelectedData } = this.props

    if(!data) {
      return null
    }

    if(data.longitude === null || data.longitude === undefined || data.longitude === '' || data.latitude === null || data.latitude === undefined || data.latitude === '') {
      return null
    }

    const lngLat = [ data.longitude, data.latitude ]

    // Create Popup
    const popup = new Popup({ focusAfterOpen: false, maxWidth: '360px' })
      .setHTML(`<div class='custom-popup-container'>
          ${data?.exact_address}</div>`)

    popup.on('close', () => {
      _handleClearSelectedData()
    });

    if(defaultMarker || (data && !data?.isCctv) || ( data && data?.isSelectedPoint)) {
      // Create Marker Element
      const marker = new Marker()
        .setLngLat(lngLat)
        .setPopup(defaultMarker ? null : popup)
      
      const markerEl = marker.getElement()
      if(markerEl) {
        // markerEl.addEventListener('click',() => dispatch(setSelectedDataId(data?.id)))
        markerEl.addEventListener('click',() => handleMarkerClick(data))

      }

      map.flyTo({
          center: [data.longitude, data.latitude ],
          zoom: 16
      })

      return { marker, data }
    }

    // Create Marker Element
    const markerElement = this._createMarkerElement()
    const marker = new Marker(markerElement)
      .setLngLat(lngLat)
      .setPopup(defaultMarker ? null : popup)
    
    const markerEl = marker.getElement()
    if(markerEl) {
      markerEl.addEventListener('click',() => handleMarkerClick(data))
    }
    
    return { marker, data }
  }

  // Create Narker Element
  _createMarkerElement = () => {
    // Create a DOM element for marker
    const icon = document.createElement('img')
    icon.className = 'maplibregl-marker'
    icon.src = cctvIcon
    icon.style.width = '16px'
    icon.style.height = '16x'
    icon.style.cursor = 'pointer'
    return icon
  }

  // Fit Bounds
  _fitBounds = markerData => {
    const { map } = this.state
    let ifFitBounds = true
    // To GeoJSON
    if(markerData && markerData.length){
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


      //
      if(f?.geometry?.type === 'Point') {
        // Add Polygon Layer
        map.addLayer({
            'id': `${ geojsonLayerId }-${ i }`,
            'type': 'circle',
            'source': `${ geojsonSourceId }-${ i }`,
            'layout': {
              'visibility': 'visible'
              },
            "paint": {
              "circle-radius": 35,
              "circle-opacity": .1,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#0059FF",
              "circle-stroke-opacity": 1,
          },
          "filter": ["==", '$type', "Point"],
        })
    }
//
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
                'fill-opacity': f?.properties?.opacity ?? 0.1,
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
                  'fill-color': f?.properties?.fillColor ?? '#0080ff',
                  'fill-opacity': f?.properties?.opacity ?? 0.1,

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
  minHeight: '750px',
  overflow: 'hidden',
  border: '1px solid #dcdcdc',
  borderRadius: '4px',
  flex: 1
}

// Prop Types
MapGL.propTypes = {
  markerData: PropTypes.array,
  defaultMarker: PropTypes.bool,
  geoJsonData: PropTypes.object,
  handleMarkerClick: PropTypes.func,
}

MapGL.defaultProps = {
  markerData: [],
  defaultMarker: false,
  geoJsonData: {},
  handleMarkerClick: () => null
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(MapGL)