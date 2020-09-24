const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
let axisRepository = function () {
  let getGoalsByAxis = async (params) => {
    return await executeSpWithConn(main, `Axis_GetGoalsById(?)`, params)
  }

  let savePeriodGoals = async (params) => {
    return await executeSpWithConn(main, `Axis_SavePeriodGoals(?, ?, ?, ?, ?)`, params)
  }

  return {
    getGoalsByAxis: getGoalsByAxis,
    savePeriodGoals: savePeriodGoals
  }
}

module.exports = axisRepository()
