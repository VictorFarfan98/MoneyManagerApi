const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
let authorizationRepository = function () {
  let authorizeWIG = async (params) => {
    return await executeSpWithConn(main, `WIG_Authorize(?,?,?,?)`, params)
  }

  let authorizePredictive = async (params) => {
    return await executeSpWithConn(main, `Predictive_Authorize(?,?,?,?)`, params)
  }

  let authorizeAxis = async (params) => {
    return await executeSpWithConn(main, `Axis_Authorize(?,?,?)`, params)
  }

  let authorizeTeam = async (params) => {
    return await executeSpWithConn(main, `Team_Authorize(?,?,?)`, params)
  }

  let authorizeCommitment = async (params) => {
    return await executeSpWithConn(main, `Commitment_Authorize(?,?,?,?)`, params)
  }

  return {
    authorizeCommitment: authorizeCommitment,
    authorizeWIG: authorizeWIG,
    authorizePredictive: authorizePredictive,
    authorizeAxis: authorizeAxis,
    authorizeTeam: authorizeTeam
  }
}

module.exports = authorizationRepository()
