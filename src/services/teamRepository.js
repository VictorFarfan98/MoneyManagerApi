const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
const teamRepository = function () {
    const saveTeam = async (params) => {
        return await executeSpWithConn(main, `Team_Save(?,?,?,?,?)`, params)
    }

    const addMemberToTeam = async (params) => {
        return await executeSpWithConn(main, `Team_AddUser(?,?,?)`, params)
    }

    const getTeamsByUserId = async (params) => {
        return await executeSpWithConn(main, `Team_GetAllByUserId(?)`, params)
    }

    const getTeamById = async (params) => {
        return await executeSpWithConn(main, `Team_GetById(?)`, params)
    }

    const getAllTeams = async (params) => {
        return await executeSpWithConn(main, `Team_GetAll()`, params)
    }

    const getTeamMembers = async (params) => {
        return await executeSpWithConn(main, `User_GetByTeamId(?)`, params)
    }

    const updateTeam = async (params) => {
        return await executeSpWithConn(main, `Team_Update(?,?,?,?)`, params)
    }

    const deleteTeam = async (params) => {
        return await executeSpWithConn(main, `Team_Delete(?)`, params)
    }

    const deleteUserFromTeam = async (params) => {
        return await executeSpWithConn(main, `User_DeleteFromTeam(?, ?)`, params)
    }

    const updateTeamAccountability = async (params) => {
        return await executeSpWithConn(main, `Team_UpdateAccountability(?,?,?)`, params)
    }

    const getTeamBySpecialistId = async (params) => {
        return await executeSpWithConn(main, `Team_GetBySpecialist(?)`, params)
    }

    return {
        saveTeam: saveTeam,
        addMemberToTeam: addMemberToTeam,
        getTeamsByUserId: getTeamsByUserId,
        getAllTeams: getAllTeams,
        getTeamMembers: getTeamMembers,
        updateTeam: updateTeam,
        deleteTeam: deleteTeam,
        deleteUserFromTeam,
        getTeamById: getTeamById,
        getTeamBySpecialistId: getTeamBySpecialistId,
        updateTeamAccountability: updateTeamAccountability
    }
}

module.exports = teamRepository()
