const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
const questionsRepository = function () {
    const getAllQuestions = async (params) => {
        return await executeSpWithConn(main, `Questions_GetAll()`, params)
    }

    const saveAcQuestions = async (params) => {
        return await executeSpWithConn(main, `AccountabilityRecord_Save(?, ?, ?, ?, ?)`, params)
    }

    const getRecordsbyTeam = async (params) => {
        return await executeSpWithConn(main, `Records_GetByTeam(?)`, params)
    }

    const getRecordbyId = async (params) => {
        return await executeSpWithConn(main, `Record_GetById(?)`, params)
    }

    const getParticipantsbyRecordId = async (params) => {
        return await executeSpWithConn(main, `Record_GetParticipantsByRecordId(?)`, params)
    }

    return {
        getAllQuestions: getAllQuestions,
        saveAcQuestions: saveAcQuestions,
        getRecordsbyTeam: getRecordsbyTeam,
        getRecordbyId: getRecordbyId,
        getParticipantsbyRecordId: getParticipantsbyRecordId
    }
}
  
module.exports = questionsRepository()