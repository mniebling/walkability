import leaflet from 'leaflet'

const HALF_MILE = 804 // meters
const MILE = 1609 // meters
const MILE_AND_A_HALF = 2414 // meters

/**
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @returns {leaflet.Polygon[]} An array with three polygons representing the walkability zones
 */
export function getRectangles(lat, lng) {

  const centerLatLng = leaflet.latLng(lat, lng)

  const shortBounds = centerLatLng.toBounds(HALF_MILE * 2) // multiply offset by 2 to get bounds
  const mediumBounds = centerLatLng.toBounds(MILE * 2)
  const longBounds = centerLatLng.toBounds(MILE_AND_A_HALF * 2)

  const short = leaflet.polygon(getLatLngsFromBounds(shortBounds), {
    color: 'green',
    fill: false,
  })

  const medium = leaflet.polygon(getLatLngsFromBounds(mediumBounds), {
    color: 'blue',
    fill: false,
  })

  const long = leaflet.polygon(getLatLngsFromBounds(longBounds), {
    color: 'red',
    fill: false,
  })

  return [long, medium, short] // return in reverse order so `forEach` respect the z-index we want
}

// Order is very important here
function getLatLngsFromBounds(bounds) {

  return [
    bounds.getSouthWest(),
    bounds.getSouthEast(),
    bounds.getNorthEast(),
    bounds.getNorthWest(),
  ]
}
