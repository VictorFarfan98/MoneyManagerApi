const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
let trackingRepository = function () {

  let saveTracking = async (params) => {
    return await executeSpWithConn(main, `Tracking_Save(?,?,?,?,?)`, params)
  }

  let getTrackingByAxisId = async (params) => {
    return await executeSpWithConn(main, `Tracking_GetByAxisId(?)`, params)
  }

  return {
    getTrackingByAxisId: getTrackingByAxisId,
    saveTracking: saveTracking
  }
}

module.exports = trackingRepository()
