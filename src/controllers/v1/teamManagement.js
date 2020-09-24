const responses = require('../../utils/responses')
const security = require('../../utils/security')
const createError = require('http-errors')
const teamRepository = require('../../services/teamRepository')
const authorizationRepo = require('../../services/authorizationRepository')
const teamModel = require('../../models/teamModel')
const { validateModel } = require('../../utils/validator')
const { RESPONSE_MESSAGES, PERMISSIONS } = require('../../components/Constants')

/**
 * Save a new Team
 */
exports.saveTeam = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.CREATE,
            pTeamId: null
        }

        let result = await authorizationRepo.authorizeTeam(params)

        if (!result[0][0].hasPermission) {
            next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
        }

        // Validate model
        if (!validateModel(teamModel.teamCreateSchema, req.body).isValid) {
            next(createError(400))
            return
        }

        // Create params object
        params = {
            pTitle: req.body.title.trim(),
            pParentTeamId: (req.body.parentTeamId === undefined ? null : req.body.parentTeamId),
            pCreatedBy: security.userId,
            pLeaderId: (req.body.leaderId === undefined ? null : req.body.leaderId),
            pSpecialistId: (req.body.specialistId === undefined ? null : req.body.specialistId)
        }

        console.debug(params)

        result = await teamRepository.saveTeam(params)

        if (result && !('Error' in result[0][0])) {
            res.status(201).json(responses.webResponse(true, result[0][0]))
        } else if (result && result[0] && ('ErrorCode' in result[0][0])) {
            next(createError(result[0][0].ErrorCode, result[0][0].Error))
        } else {
            next(createError(422))
        }

    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
* Save new team Member
*/
exports.saveTeamMember = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.ADD_MEMBER,
            pTeamId: req.params.teamId
        }

        let result = await authorizationRepo.authorizeTeam(params)

        if (!result[0][0].hasPermission) {
            next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
        }

        // Validate model
        if (!validateModel(teamModel.addTeamMemberSchema, req.body).isValid) {
            next(createError(400))
            return
        }

        // Create params object
        params = {
            pTeamId: req.params.teamId,
            pUserId: req.body.userId,
            pDataRoleId: req.body.dataRoleId
        }

        result = await teamRepository.addMemberToTeam(params)

        if (result && !('Error' in result[0][0])) {
            res.status(201).json(responses.webResponse(true, result[0][0]))
        } else if (result && result[0] && ('ErrorCode' in result[0][0])) {
            next(createError(result[0][0].ErrorCode, result[0][0].Error))
        } else {
            next(createError(422))
        }
    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Get Teams by user Id
 */
exports.getTeamsByUserId = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        params = {
            pUserId: security.userId
        }

        result = await teamRepository.getTeamsByUserId(params)
        if (!Array.isArray(result)) {
            console.error(err)
            next(createError(500))
        } else {
            res.json(responses.webResponse(true, result[0]))
        }
    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Get Teams by user Id
 */
exports.getAllTeams = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {}

        result = await teamRepository.getAllTeams(params)
        if (!Array.isArray(result)) {
            console.error(err)
            next(createError(500))
        } else {
            res.json(responses.webResponse(true, result[0]))
        }
    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Get Teams by user Id
 */
exports.getTeamMembers = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.READ,
            teamId: req.params.teamId
        }

        let result = await authorizationRepo.authorizeTeam(params)

        if (!result[0][0].hasPermission) {
            next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
        }

        params = {
            teamId: req.params.teamId
        }

        result = await teamRepository.getTeamMembers(params)
        if (!Array.isArray(result)) {
            console.error(err)
            next(createError(500))
        } else {
            res.json(responses.webResponse(true, result[0]))
        }
    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Update a new Team
 */
exports.updateTeam = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.UPDATE,
            pTeamId: req.params.teamId
        }

        let result = await authorizationRepo.authorizeTeam(params)

        if (!result[0][0].hasPermission) {
            next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
        }

        // Validate model
        if (!validateModel(teamModel.teamUpdateSchema, req.body).isValid) {
            next(createError(400))
            return
        }

        // Create params object
        params = {
            pTeamId: req.params.teamId,
            pTitle: req.body.title.trim(),
            pParentTeamId: (req.body.parentTeamId === undefined ? null : req.body.parentTeamId),
            pSpecialistId: (req.body.specialistId === undefined ? null : req.body.specialistId)
        }

        console.debug(params)

        result = await teamRepository.updateTeam(params)

        if (result && !('Error' in result[0][0])) {
            res.status(200).json(responses.webResponse(true, result[0][0]))
        } else if (result && result[0] && ('ErrorCode' in result[0][0])) {
            next(createError(result[0][0].ErrorCode, result[0][0].Error))
        } else {
            next(createError(422))
        }

    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Delete Team
 */
exports.deleteTeam = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.DELETE,
            pTeamId: req.params.teamId
        }

        let result = await authorizationRepo.authorizeTeam(params)

        // Create params object
        params = {
            pTeamId: req.params.teamId,
        }

        console.debug(params)

        result = await teamRepository.deleteTeam(params)

        if (result && !('Error' in result[0][0])) {
            res.status(204).json(responses.webResponse(true, result[0][0]))
        } else if (result && result[0] && ('ErrorCode' in result[0][0])) {
            next(createError(result[0][0].ErrorCode, result[0][0].Error))
        } else {
            next(createError(422))
        }

    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Delete User from Team
 */
exports.deleteUserFromTeam = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.DELETE,
            pTeamId: req.params.teamId
        }

        let result = await authorizationRepo.authorizeTeam(params)

        // Create params object
        params = {
            pTeamId: req.params.teamId,
            pUserId: req.params.userId,
        }

        console.debug(params)

        result = await teamRepository.deleteUserFromTeam(params)

        if (result && !('Error' in result[0][0])) {
            res.status(204).json(responses.webResponse(true, result[0][0]))
        } else if (result && result[0] && ('ErrorCode' in result[0][0])) {
            next(createError(result[0][0].ErrorCode, result[0][0].Error))
        } else {
            next(createError(422))
        }

    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Get Team by Id
 */
exports.getTeamById = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.READ,
            pTeamId: req.params.teamId
        }

        let result = await authorizationRepo.authorizeTeam(params)

        if (!result[0][0].hasPermission) {
            next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
        }

        params = {
            pTeamId: req.params.teamId
        }

        result = await teamRepository.getTeamById(params)
        if (!Array.isArray(result)) {
            console.error(err)
            next(createError(500))
        } else {
            res.json(responses.webResponse(true, result[0][0]))
        }
    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Update a new Team Accountability
 */
exports.updateTeamAccountability = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.UPDATE,
            pTeamId: req.params.teamId
        }

        let result = await authorizationRepo.authorizeTeam(params)

        if (!result[0][0].hasPermission) {
            next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
        }

        // Validate model
        if (!validateModel(teamModel.teamAccountabilitySchema, req.body).isValid) {
            next(createError(400))
            return
        }

        // Create params object
        params = {
            pTeamId: req.params.teamId,
            pTime: req.body.time,
            pDay: req.body.day
        }

        console.debug(params)

        result = await teamRepository.updateTeamAccountability(params)

        if (result && !('Error' in result[0][0])) {
            res.status(200).json(responses.webResponse(true, result[0][0]))
        } else if (result && result[0] && ('ErrorCode' in result[0][0])) {
            next(createError(result[0][0].ErrorCode, result[0][0].Error))
        } else {
            next(createError(422))
        }

    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Get Team by Specialist
 */
exports.getTeamBySpecialist = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pSpecialistId: null
        }

        if (req.query.getAll !== 'true') {
            params = {
                pSpecialistId: security.userId
            }

        }

        result = await teamRepository.getTeamBySpecialistId(params)
        if (!Array.isArray(result)) {
            console.error(err)
            next(createError(500))
        } else {
            res.json(responses.webResponse(true, result[0]))
        }
    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}