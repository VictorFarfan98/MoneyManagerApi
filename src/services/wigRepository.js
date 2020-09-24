const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
let wigRepository = function () {
  let getWIGById = async (params) => {
    return await executeSpWithConn(main, `WIG_GetById(?)`, params)
  }

  let getWIGByUserId = async (params) => {
    return await executeSpWithConn(main, `WIG_GetByUserId(?)`, params)
  }

  let getWIGByTeamIdAndYear = async (params) => {
    return await executeSpWithConn(main, `WIG_GetByTeamIdAndYear(?,?)`, params)
  }
  
  let getWIGByUserIdAndYear = async (params) => {
    return await executeSpWithConn(main, `WIG_GetByUserIdAndYear(?,?)`, params)
  }

  let getWIGAxes = async (params) => {
    return await executeSpWithConn(main, `WIG_GetAxes(?)`, params)
  }

  let getWIGGoalsById = async (params) => {
    return await executeSpWithConn(main, `WIG_GetGoalsById(?)`, params)
  }

  let saveWIG = async (params) => {
    return await executeSpWithConn(main, `WIG_Save(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, params)
  }

  let updateWIG = async (params) => {
    return await executeSpWithConn(main, `WIG_Update(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, params)
  }

  let deleteWIG = async (params) => {
    return await executeSpWithConn(main, `WIG_Delete(?)`, params)
  }

  let saveWIGTracking = async (params) => {
    return await executeSpWithConn(main, `Tracking_WIG_Save(?,?,?,?,?,?,?)`, params)
  }

  return {
    getWIGById: getWIGById,
    getWIGByUserId: getWIGByUserId,
    getWIGByTeamIdAndYear: getWIGByTeamIdAndYear,
    getWIGByUserIdAndYear: getWIGByUserIdAndYear,
    getWIGAxes: getWIGAxes,
    getWIGGoalsById: getWIGGoalsById,
    saveWIG: saveWIG,
    updateWIG: updateWIG,
    deleteWIG: deleteWIG,
    saveWIGTracking: saveWIGTracking
  }
}

module.exports = wigRepository()
