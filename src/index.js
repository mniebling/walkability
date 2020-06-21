import leaflet from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

import { getPosition, getRectangles, getSearchBounds } from './utils'
import pinImageUrl from './img/pin.svg'
import pinShadowUrl from './img/marker-shadow.png'


// Set up Leaflet map with OSM tiles
const map = leaflet.map('map')
const tileLayer = leaflet.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  detectRetina: true,
})

map.addLayer(tileLayer)

const pinIcon = leaflet.icon({
  iconAnchor: [11, 31],
  iconSize: [22, 34],
  iconUrl: pinImageUrl,
  shadowAnchor: [8, 33],
  shadowSize: [22, 34],
  shadowUrl: pinShadowUrl,
})

// Actually draw the rectangles after a user selects a location
let rectangles = []

map.on('geosearch/showlocation', event => {
  // Remove old ones from the map (if there are any already there)
  rectangles.forEach(r => r.remove())

  // Fetch and add the new ones
  rectangles = getRectangles(event.location.y, event.location.x)
  rectangles.forEach(r => r.addTo(map))
})

// Get user's initial position, or use default if geolocation fails (e.g., user denies permission)
const startLocation = {}
const START_ZOOM = 14

getPosition()
  .then(position => {
    startLocation.latitude = position.coords.latitude
    startLocation.longitude = position.coords.longitude
  })
  .catch(() => {
    startLocation.latitude = 41.97 // Chicago
    startLocation.longitude = -87.68
  })
  .finally(() => {
    map.setView([startLocation.latitude, startLocation.longitude], START_ZOOM)

    console.info(`Starting location: https://www.google.com/maps/place/${startLocation.latitude},${startLocation.longitude}`)

    // Setting up the search after the initial position is known so that we can
    // constrain search results to a rectangle based on the user's position.
    const searchProvider = new OpenStreetMapProvider({
      params: {
        viewbox: getSearchBounds(startLocation.latitude, startLocation.longitude)
      },
    })

    const searchControl = new GeoSearchControl({
      autoClose: true,
      autoComplete: true,
      autoCompleteDelay: 500,
      keepResult: true,
      marker: {
        draggable: false,
        icon: pinIcon,
      },
      provider: searchProvider,
      retainZoomLevel: true,
      showMarker: true,
      style: 'bar',
    })

    map.addControl(searchControl)
  })
