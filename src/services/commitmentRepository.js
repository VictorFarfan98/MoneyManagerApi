const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
let commitmentRepository = function () {
  let getCommitmentById = async (params) => {
    return await executeSpWithConn(main, `Commitment_GetById(?)`, params)
  }

  let getCommitmentByTeam = async (params) => {
    return await executeSpWithConn(main, `Commitment_GetByTeamId(?)`, params)
  }

  let saveCommitment = async (params) => {
    return await executeSpWithConn(main, `Commitment_Save(?,?,?,?,?,?)`, params)
  }

  let saveCommitmentTracking = async (params) => {
    return await executeSpWithConn(main, `CommitmentTracking_Save(?,?,?,?)`, params)
  }

  let deleteCommitment = async (params) => {
    return await executeSpWithConn(main, `Commitment_Delete(?)`, params)
  }

  let getExternalCommitments = async (params) => {
    return await executeSpWithConn(main, `Commitment_GetExternalByUser(?)`, params)
  }
  return {
    getCommitmentById: getCommitmentById,
    getCommitmentByTeam: getCommitmentByTeam,
    saveCommitment: saveCommitment,
    saveCommitmentTracking: saveCommitmentTracking,
    getExternalCommitments: getExternalCommitments,
    deleteCommitment: deleteCommitment
  }
}

module.exports = commitmentRepository()
