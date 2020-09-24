const responses = require('../../utils/responses')
const security = require('../../utils/security')
const { validateModel } = require('../../utils/validator')
const createError = require('http-errors')
const commitmentRepo = require('../../services/commitmentRepository')
const { getTeamMembers } = require('../../services/teamRepository')
const authorizationRepo = require('../../services/authorizationRepository')
const commitmentModel = require('../../models/commitmentModel')
const { RESPONSE_MESSAGES, PERMISSIONS } = require('../../components/Constants')

/**
 * Get Commitment by team Id
 */
exports.getCommitmentByTeamId = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.READ,
      pCommitmentId: null,
      pTeamId: req.params.teamId
    }

    let result = await authorizationRepo.authorizeCommitment(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pTeamId: req.params.teamId
    }

    result = await commitmentRepo.getCommitmentByTeam(params)
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
 * Get External Commitments by User
 */
exports.getExternalCommitments = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId
    }

    result = await commitmentRepo.getExternalCommitments(params)
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
 * Get Commitment by Id
 */
exports.getCommitmentById = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.READ,
      pCommitmentId: req.params.commitmentId,
      pTeamId: null
    }

    let result = await authorizationRepo.authorizeCommitment(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pCommitmentId: req.params.commitmentId
    }

    result = await commitmentRepo.getCommitmentById(params)
    if (!Array.isArray(result)) {
      console.error(err)
      next(createError(500))
    } else if (result[0].length === 0) {
      next(createError(404))
    } else {
      res.json(responses.webResponse(true, result[0][0]))
    }
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Save Commitment
 */
exports.saveCommitment = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.CREATE,
      pCommitmentId: null,
      pTeamId: req.params.teamId
    }

    let result = await authorizationRepo.authorizeCommitment(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    // Validate model
    if (!validateModel(commitmentModel.commitmentCreateSchema, req.body).isValid) {
      next(createError(400))
      return
    }
    // Create object for creating commitment
    let assignedTo = req.body.assignedUser
    if (req.body.applyForAllMembers) {
      // Get team members
      params = {
        teamId: req.params.teamId
      }

      let members = await getTeamMembers(params)
      members = members[0]
      members = members.map(x => x.userId)

      assignedTo = JSON.stringify(members)
    }

    // Create params object
    params = {
      userId: security.userId,
      pWIGId: req.params.wigId,
      title: req.body.title.trim(),
      assignedTo: assignedTo,
      dependencyUser: (req.body.dependencyUser || null),
      when: req.body.when.trim()
    }

    result = await commitmentRepo.saveCommitment(params)

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
 * Save Commitment Tracking
 */
exports.saveCommitmentTracking = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return null
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.TRACK,
      pCommitment: req.params.commitmentId,
      pTeamId: req.params.teamId
    }

    console.debug(params)
    let result = await authorizationRepo.authorizeCommitment(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    // Validate model
    if (!validateModel(commitmentModel.commitmentTrackingSchema, req.body).isValid) {
      next(createError(400))
      return
    }
    // Changes to commitment
    let status = 1
    if (req.body.isDone) {
      status = 2
    } else if (req.body.isClosed) {
      status = 3
    }

    // Create params object
    params = {
      userId: security.userId,
      pCommitmentId: req.params.commitmentId,
      pCommentary: req.body.commentary,
      pStatus: status
    }

    console.debug(params)
    result = await commitmentRepo.saveCommitmentTracking(params)

    res.status(201).json(responses.webResponse(true, result[0][0]))
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}


/**
 * Delete Commitment
 */
exports.deleteCommitment = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return null
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.DELETE,
      pCommitment: req.params.commitmentId,
      pTeamId: req.params.teamId
    }

    console.debug(params)
    let result = await authorizationRepo.authorizeCommitment(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    /*
    // Validate model
    if (!validateModel(commitmentModel.commitmentTrackingSchema, req.body).isValid) {
      next(createError(400))
      return
    }
    // Changes to commitment
    let status = 1
    if (req.body.isDone) {
      status = 2
    } else if (req.body.isClosed) {
      status = 3
    }
*/
    // Create params object
    params = {
      pCommitmentId: req.params.commitmentId,
    }

    console.debug(params)
    result = await commitmentRepo.deleteCommitment(params)

    res.status(204).json(responses.webResponse(true, result[0][0]))
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}
