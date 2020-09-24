const responses = require('../../utils/responses')
const security = require('../../utils/security')
const { validateModel } = require('../../utils/validator')
const createError = require('http-errors')
const predictiveRepo = require('../../services/predictiveRepository')
const authorizationRepo = require('../../services/authorizationRepository')
const model = require('../../models/predictiveModel')
const { RESPONSE_MESSAGES, PERMISSIONS } = require('../../components/Constants')
const { changeIncomingValue, changeOutgoingValue } = require('../../utils/dataTypeFormatter')

/**
 * Get predictive filter
 */
exports.getPredictiveByWIGId = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }
    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.READ,
      pPredictiveId: null,
      pWIGId: req.params.wigId
    }

    let result = await authorizationRepo.authorizePredictive(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pWIGId: req.params.wigId
    }

    result = await predictiveRepo.getPredictiveByWIG(params)

    if (!Array.isArray(result)) {
      console.error(err)
      next(createError(500))
    } else {
      // Act on goal according to the predictive type
      result = changeOutgoingPredictives(result[0])

      res.json(responses.webResponse(true, result))
    }

  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Get Predictive by Id
 */
exports.getPredictiveById = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.READ,
      pPredictiveId: req.params.predictiveId,
      pWIGId: null
    }

    let result = await authorizationRepo.authorizePredictive(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pPredictiveId: req.params.predictiveId
    }

    result = await predictiveRepo.getPredictiveById(params)
    if (!Array.isArray(result)) {
      console.error(err)
      next(createError(500))
    } else if (result[0].length === 0) {
      next(createError(404))
    } else {

      // Act on goal according to the predictive type
      result = changeOutgoingPredictives(result[0])

      res.json(responses.webResponse(true, result[0]))
    }

  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Save Predictive
 */
exports.savePredictive = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.CREATE,
      pPredictiveId: null,
      pWIGId: req.params.wigId
    }

    let result = await authorizationRepo.authorizePredictive(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    // Validate model
    if (!validateModel(model.predictiveCreate, req.body).isValid) {
      next(createError(400))
      return
    }

    // Changes to new WIG
    req.body = changeIncomingPredictive(req.body)

    // Create params object
    params = {
      wigId: req.params.wigId,
      userId: security.userId,
      verb: req.body.verb.trim(),
      what: req.body.what.trim(),
      focus: req.body.focus.trim(),
      quality: req.body.quality.trim(),
      consistency: req.body.consistency.trim(),
      description: req.body.description.trim(),
      y1: req.body.y1,
      x1: req.body.x1,
      displayName1: req.body.displayName1.trim(),
      dataType1: req.body.dataTypeId1,
      dir1: req.body.dir1,
      y2: null,
      x2: null,
      displayName2: null,
      dataType2: null,
      dir2: null
    }

    // Add second axis
    if (req.body.axesNumber === 2) {
      params.y2 = req.body.y2
      params.x2 = req.body.x2
      params.displayName2 = req.body.displayName2.trim()
      params.dataType2 = req.body.dataTypeId2
      params.dir2 = req.body.dir2
    }

    console.debug(`Predictive to create: ${JSON.stringify(params)}`)

    result = await predictiveRepo.savePredictive(params)

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
 * Save Predictive Tracking
 */
exports.savePredictiveTracking = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.TRACK,
      pPredictiveId: req.params.predictiveId,
      pWIGId: null
    }

    let result = await authorizationRepo.authorizePredictive(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pPredictiveId: req.params.predictiveId
    }

    let axesResult = await predictiveRepo.getPredictiveAxes(params)

    req.body.axesNumber = axesResult[0].length

    // Validate model
    if (!validateModel(model.predictiveTrackingSchema, req.body).isValid) {
      next(createError(400))
      return
    }
    // Changes to new predictive tracking
    req.body = changeIncomingPredictiveTracking(req.body, axesResult[0])

    // Create params object
    params = {
      userId: security.userId,
      pPredictiveId: req.params.predictiveId,
      pGoalAchived1: req.body.goalAchived1,
      pCommentary1: req.body.commentary1,
      pGoalAchived2: req.body.goalAchived2,
      pCommentary2: req.body.commentary2,
      pPeriod: req.body.week
    }

    result = await predictiveRepo.savePredictiveTracking(params)

    res.status(201).json(responses.webResponse(true, result[0][0]))

  } catch (error) {
    console.error(error)
    next(createError(500))
  }
}

/**
 * Update Predictive
 */
exports.updatePredictive = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.UPDATE,
      pPredictiveId: req.params.predictiveId,
      pWIGId: null
    }

    let result = await authorizationRepo.authorizePredictive(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      pPredictiveId: req.params.predictiveId
    }

    let predictiveResult = await predictiveRepo.getPredictiveById(params)

    if (predictiveResult[0].length === 0) {
      next(createError(404))
      return
    }

    req.body.axesNumber = predictiveResult[0][0].axesNumber

    // Validate model
    if (!validateModel(model.predictiveUpdateSchema, req.body).isValid) {
      next(createError(400))
      return
    }

    // Changes to new WIG
    req.body = changeIncomingPredictive(req.body)

    // Create params object
    params = {
      predictiveId: req.params.predictiveId,
      verb: req.body.verb.trim(),
      what: req.body.what.trim(),
      focus: req.body.focus.trim(),
      quality: req.body.quality.trim(),
      consistency: req.body.consistency.trim(),
      description: req.body.description.trim(),
      x1: req.body.x1,
      y1: req.body.y1,
      displayName1: req.body.displayName1.trim(),
      dataType1: req.body.dataTypeId1,
      dir1: req.body.dir1,
      x2: req.body.x2,
      y2: req.body.y2,
      displayName2: (req.body.displayName2 ? req.body.displayName2.trim() : req.body.displayName2),
      dataType2: req.body.dataTypeId2,
      dir2: req.body.dir2
    }

    console.debug(`Predictive to update: ${JSON.stringify(params)}`)

    // Act on goal according to the predictive type
    params = changeIncomingPredictive(params)

    result = await predictiveRepo.updatePredictive(params)

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
 * Delete predictive
 */
exports.deletePredictive = async (req, res, next) => {
  try {
    // Validate security
    if (!security.validateNonceAES(req.headers.nonce)) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
      return
    }

    let params = {
      pUserId: security.userId,
      pAction: PERMISSIONS.DELETE,
      pPredictiveId: req.params.predictiveId,
      pWIGId: null
    }

    let result = await authorizationRepo.authorizePredictive(params)

    if (!result[0][0].hasPermission) {
      next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
      return
    }

    params = {
      predictiveId: req.params.predictiveId
    }
    result = await predictiveRepo.deletePredictive(params)
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
 * Modify incoming predictives
 */
function changeIncomingPredictive(predictive) {
  for (let index = 1; index <= predictive.axesNumber; index++) {
    // Act on goal according to the data type
    predictive[`x${index}`] = changeIncomingValue(predictive[`x${index}`], predictive[`dataTypeId${index}`])
    predictive[`y${index}`] = changeIncomingValue(predictive[`y${index}`], predictive[`dataTypeId${index}`])
  }

  return predictive
}

/**
 * Modify outgoing predictives
 */
function changeOutgoingPredictives(predictives) {
  // Act on goal according to the predictive type
  predictives.forEach(predictive => {
    for (let index = 1; index <= 2; index++) {
      if (predictive[`dataTypeId${index}`]) {
        // Act on goal according to the data type
        predictive[`x${index}`] = changeOutgoingValue(predictive[`x${index}`], predictive[`dataTypeId${index}`])
        predictive[`y${index}`] = changeOutgoingValue(predictive[`y${index}`], predictive[`dataTypeId${index}`])
      }
    }
  })
  return predictives
}

/**
 * Modify incoming predictive tracking
 */
function changeIncomingPredictiveTracking(tracking, axes) {

  tracking.goalAchived1 = changeIncomingValue(tracking.goalAchived1, axes[0].dataTypeId)

  if (axes.length === 2) {
    tracking.goalAchived2 = changeIncomingValue(tracking.goalAchived2, axes[1].dataTypeId)
  }

  return tracking
}

