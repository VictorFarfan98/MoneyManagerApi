const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
let predictiveRepository = function () {
  let getPredictiveById = async (params) => {
    return await executeSpWithConn(main, `Predictive_GetById(?)`, params)
  }

  let getPredictiveByWIG = async (params) => {
    return await executeSpWithConn(main, `Predictive_GetByWIGId(?)`, params)
  }

  let getPredictiveAxes = async (params) => {
    return await executeSpWithConn(main, `Predictive_GetAxes(?)`, params)
  }

  let savePredictive = async (params) => {
    return await executeSpWithConn(main, `Predictive_Save(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, params)
  }

  let savePredictiveTracking = async (params) => {
    return await executeSpWithConn(main, `Tracking_PredictiveSave(?,?,?,?,?,?,?)`, params)
  }

  let updatePredictive = async (params) => {
    return await executeSpWithConn(main, `Predictive_Update(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, params)
  }

  let deletePredictive = async (params) => {
    return await executeSpWithConn(main, `Predictive_Delete(?)`, params)
  }

  return {
    getPredictiveById: getPredictiveById,
    getPredictiveByWIG: getPredictiveByWIG,
    getPredictiveAxes: getPredictiveAxes,
    savePredictive: savePredictive,
    savePredictiveTracking: savePredictiveTracking,
    updatePredictive: updatePredictive,
    deletePredictive: deletePredictive
  }
}

module.exports = predictiveRepository()
