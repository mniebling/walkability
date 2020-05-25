import leaflet from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

import { getPosition } from './utils/get-position'
import pinImageUrl from './img/pin.svg'
import pinShadowUrl from './img/marker-shadow.png'


// Set up Leaflet map with OSM tiles
const map = leaflet.map('map')
const tileLayer = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
})

map.addLayer(tileLayer)

// Set up geosearch
const searchProvider = new OpenStreetMapProvider()
const pinIcon = leaflet.icon({
  iconAnchor: [20, 31],
  iconSize: [22, 34],
  iconUrl: pinImageUrl,
  shadowAnchor: [16, 33],
  shadowSize: [22, 34],
  shadowUrl: pinShadowUrl,
})

const searchControl = new GeoSearchControl({
  autoClose: true,
  autoComplete: true,
  autoCompleteDelay: 250,
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

// Get user's initial position, or use default if geolocation fails (e.g., user denies permission)
const startLocation = {}
const START_ZOOM = 15

getPosition()
  .then(position => {
    startLocation.latitude = position.coords.latitude
    startLocation.longitude = position.coords.longitude
  })
  .catch(() => {
    startLocation.latitude = 41.97  // Chicago
    startLocation.longitude = -87.68
  })
  .finally(() => {
    map.setView([startLocation.latitude, startLocation.longitude], START_ZOOM)
    // leaflet.marker([startLocation.latitude, startLocation.longitude], { icon: pinIcon }).addTo(map) // test marker
  })
