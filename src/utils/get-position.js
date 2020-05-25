/**
 * Wrap navigator.geolocation.getCurrentPosition in a promise.
 *
 * @param {PositionOptions} [options]
 * @returns {Promise<Position>} A geolocation position object.
 */
export function getPosition(options) {

  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  )
}
