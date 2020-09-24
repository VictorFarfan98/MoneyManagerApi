const responses = require('../../utils/responses')
const security = require('../../utils/security')
const { validateModel } = require('../../utils/validator')
const createError = require('http-errors')
const wigRepository = require('../../services/wigRepository')
const axisRepository = require('../../services/axisRepository')
const authorizationRepo = require('../../services/authorizationRepository')
const wigModel = require('../../models/wigModel')
const { changeIncomingValue, changeOutgoingValue } = require('../../utils/dataTypeFormatter')
const { RESPONSE_MESSAGES, PERMISSIONS } = require('../../components/Constants')

/**
 * Get wig filter
 */
exports.getWIGByTeam = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.READ,
      pWIGId: null,
      pTeamId: req.params.teamId
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      teamId: req.params.teamId,
      year: null
    }
    // Validate if year is in the request
    if (req.query.year !== undefined && req.query.year !== '') {
      params.year = parseInt(req.query.year)
      if (isNaN(params.year)) {
        next(createError(400))
        return
      }
    }
    // Call method to execute stored procedure
    result = await wigRepository.getWIGByTeamIdAndYear(params)

    if (!Array.isArray(result)) {
      console.error(err)
      next(createError(500))
    } else {
      // Act on goals according to the data type
      result = changeOutgoingWIG(result[0])
      res.json(responses.webResponse(true, result))
    }

  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Get WIG by Id
 */
exports.getWIGById = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.READ,
      pWIGId: req.params.wigId,
      pTeamId: null
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pWIGId: req.params.wigId
    }

    result = await wigRepository.getWIGById(params)
    if (!Array.isArray(result)) {
      console.error(err)
      next(createError(500))
    } else if (result[0].length === 0) {
      next(createError(404))
    } else {
      result = changeOutgoingWIG(result[0])
      res.json(responses.webResponse(true, result[0]))
    }
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Save WIG
 */
exports.saveWIG = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.CREATE,
      pWIGId: null,
      pTeamId: req.params.teamId
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    // Validate model
    if (!validateModel(wigModel.wigCreateSchema, req.body).isValid) {
      next(createError(400))
      return
    }
    // Changes to new WIG
    req.body = changeIncomingWIG(req.body)

    // Create params object
    params = {
      userId: security.userId,
      verb: req.body.verb.trim(),
      what: req.body.what.trim(),
      year: req.body.year,
      description: req.body.description.trim(),
      x1: req.body.x1,
      y1: req.body.y1,
      level1_1: req.body.level1_1,
      level2_1: req.body.level2_1,
      level3_1: req.body.level3_1,
      displayName1: req.body.displayName1.trim(),
      dataType1: req.body.dataTypeId1,
      x2: null,
      y2: null,
      level1_2: null,
      level2_2: null,
      level3_2: null,
      displayName2: null,
      dataType2: null,
      teamId: req.params.teamId
    }

    // Add second axis
    if (req.body.axesNumber === 2) {
      params.x2 = req.body.x2
      params.y2 = req.body.y2
      params.displayName2 = req.body.displayName2.trim()
      params.dataType2 = req.body.dataTypeId2

      params.level1_2 = req.body.level1_2
      params.level2_2 = req.body.level2_2
      params.level3_2 = req.body.level3_2
    }

    console.debug(params)
    result = await wigRepository.saveWIG(params)

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
 * Save WIG
 */
exports.saveWIGTracking = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return null
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.TRACK,
      pWIGId: req.params.wigId,
      pTeamId: null
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pWIGId: req.params.wigId
    }

    let axesResult = await wigRepository.getWIGAxes(params)

    req.body.axesNumber = axesResult[0].length

    // Validate model
    if (!validateModel(wigModel.wigTrackingSchema, req.body).isValid) {
      next(createError(400))
      return
    }
    // Changes to new WIG
    req.body = changeIncomingWIGTracking(req.body, axesResult[0])

    // Create params object
    params = {
      userId: security.userId,
      pWIGId: req.params.wigId,
      pGoalAchived1: req.body.goalAchived1,
      pCommentary1: req.body.commentary1,
      pGoalAchived2: req.body.goalAchived2,
      pCommentary2: req.body.commentary2,
      pPeriod: req.body.month
    }

    result = await wigRepository.saveWIGTracking(params)

    res.status(201).json(responses.webResponse(true, result[0][0]))
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Update WIG
 */
exports.updateWIG = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.UPDATE,
      pWIGId: req.params.wigId,
      pTeamId: null
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401))
      return
    }

    params = {
      pWIGId: req.params.wigId
    }

    let wigResult = await wigRepository.getWIGById(params)

    if (wigResult[0].length === 0) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    req.body.axesNumber = wigResult[0][0].axesNumber

    // Validate model
    if (!validateModel(wigModel.wigUpdateSchema, req.body).isValid) {
      next(createError(400))
      return
    }

    // Changes to new WIG
    req.body = changeIncomingWIG(req.body)

    // Create params object
    params = {
      pWIGId: req.params.wigId,
      verb: req.body.verb.trim(),
      what: req.body.what.trim(),
      description: req.body.description.trim(),
      x1: req.body.x1,
      y1: req.body.y1,
      level1_1: req.body.level1_1,
      level2_1: req.body.level2_1,
      level3_1: req.body.level3_1,
      displayName1: req.body.displayName1.trim(),
      dataType1: req.body.dataTypeId1,
      x2: req.body.x2,
      y2: req.body.y2,
      level1_2: req.body.level1_2,
      level2_2: req.body.level2_2,
      level3_2: req.body.level3_2,
      displayName2: (req.body.displayName2 ? req.body.displayName2.trim() : req.body.displayName2),
      dataType2: req.body.dataTypeId2
    }

    result = await wigRepository.updateWIG(params)

    if (result && !('Error' in result[0][0])) {
      res.status(200).json(responses.webResponse(true, result[0][0]))
    } else {
      if (result && result[0] && ('ErrorCode' in result[0][0])) { next(createError(result[0][0].ErrorCode)) } else { next(createError(422)) }
    }
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Delete WIG
 */
exports.deleteWIG = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.DELETE,
      pWIGId: req.params.wigId,
      pTeamId: null
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      wigId: req.params.wigId
    }
    result = await wigRepository.deleteWIG(params)
    if (result && !('Error' in result[0][0])) {
      res.status(204).json(responses.webResponse(true, result[0][0]))
    } else {
      next(createError(422))
    }
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Save WIG Goals
 */
exports.saveWIGGoals = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return null
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.UPDATE,
      pWIGId: req.params.wigId,
      pTeamId: null
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pWIGId: req.params.wigId
    }

    let axesResult = await wigRepository.getWIGAxes(params)
    axesResult = axesResult[0]
    req.body.axesNumber = axesResult.length

    // Validate model
    if (!validateModel(wigModel.wigGoalsSchema, req.body).isValid) {
      next(createError(400))
      return
    }
    // Changes to new WIG
    req.body = changeIncomingGoals(req.body, axesResult)

    for (let index = 1; index <= req.body.axesNumber; index++) {

      if(!req.body.hasOwnProperty([`goals${index}`])){
        next(createError(400))
        return
      }
      
      // Create params object
      params = {
        pAxisId: axesResult[index - 1][`id`],
        pGoals: JSON.stringify(req.body[`goals${index}`]),
        pGoals_level3: JSON.stringify(req.body[`goals${index}_level3`]),
        pGoals_level2: JSON.stringify(req.body[`goals${index}_level2`]),
        pGoals_level1: JSON.stringify(req.body[`goals${index}_level1`]),
      }
      console.debug(params)
      await axisRepository.savePeriodGoals(params)
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Get WIG Goals by Id
 */
exports.getWIGGoalsById = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.READ,
      pWIGId: req.params.wigId,
      pTeamId: null
    }

    let result = await authorizationRepo.authorizeWIG(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pWIGId: req.params.wigId
    }
    // Get axes
    let axesResult = await wigRepository.getWIGAxes(params)

    let finalResult = {}
    finalResult.axesNumber = axesResult[0].length
    for (let index = 0; index < axesResult[0].length; index++) {
      params = {
        pAxisId: axesResult[0][index].id
      }

      result = await axisRepository.getGoalsByAxis(params) 
      finalResult[`goals${index + 1}`] = result[0]
    }

    finalResult = changeOutgoingGoals(finalResult)
    res.json(responses.webResponse(true, finalResult))

  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Modify incoming wig
 */
function changeIncomingWIG(wig) {

  for (let index = 1; index <= wig.axesNumber; index++) {
    // Act on goal according to the data type
    wig[`x${index}`] = changeIncomingValue(wig[`x${index}`], wig[`dataTypeId${index}`])
    wig[`y${index}`] = changeIncomingValue(wig[`y${index}`], wig[`dataTypeId${index}`])
  }

  return wig
}

/**
 * Modify incoming wig
 */
function changeIncomingWIGTracking(tracking, axes) {

  tracking.goalAchived1 = changeIncomingValue(tracking.goalAchived1, axes[0].dataTypeId)

  if (axes.length === 2) {
    tracking.goalAchived2 = changeIncomingValue(tracking.goalAchived2, axes[1].dataTypeId)
  }

  return tracking
}

/**
 * Modify outgoing WIG
 */
function changeOutgoingWIG(wigs) {
  // Act on goal according to the predictive type
  wigs.forEach(wig => {
    wig.x1 = changeOutgoingValue(wig.x1, wig.dataTypeId1)
    wig.y1 = changeOutgoingValue(wig.y1, wig.dataTypeId1)

    wig.x2 = changeOutgoingValue(wig.x2, wig.dataTypeId2)
    wig.y2 = changeOutgoingValue(wig.y2, wig.dataTypeId2)
  })
  return wigs
}


/**
 * Modify incoming goals
 */
function changeIncomingGoals(goalsBody, axis) {

  for (let index = 1; index <= goalsBody.axesNumber; index++) {
    // Act on goal according to the data type
    goalsBody[`goals${index}`] = changeIncomingValue(goalsBody[`goals${index}`], axis[index - 1][`dataTypeId`])
  }

  return goalsBody
}

/**
 * Modify incoming goals
 */
function changeOutgoingGoals(goalsBody) {

  for (let index = 1; index <= goalsBody.axesNumber; index++) {
    for (const goal of goalsBody[`goals${index}`]) {
      goal.goal = changeOutgoingValue(goal.goal, goal.dataTypeId)
      goal.x = changeOutgoingValue(goal.x, goal.dataTypeId)
      goal.y  = changeOutgoingValue(goal.y, goal.dataTypeId)
    }
  }

  return goalsBody
}