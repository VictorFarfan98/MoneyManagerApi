const responses = require('../../utils/responses')
const security = require('../../utils/security')
const { validateModel } = require('../../utils/validator')
const createError = require('http-errors')
const wigRepository = require('../../services/wigRepository')
const authorizationRepo = require('../../services/authorizationRepository')
const wigModel = require('../../models/wigModel')
const { changeIncomingValue, changeOutgoingValue } = require('../../utils/dataTypeFormatter')
const { RESPONSE_MESSAGES, PERMISSIONS } = require('../../components/Constants')


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

        req.body.axesNumber = axesResult[0].length

        // Validate model
        if (!validateModel(wigModel.wigGoalsSchema, req.body).isValid) {
            next(createError(400))
            return
        }
        // Changes to new WIG
        req.body = changeIncomingGoals(req.body, axesResult[0])

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
 * Modify incoming goals
 */
function changeIncomingGoals(goalsBody) {

    goalsBody.goals1 = changeIncomingValue(goalsBody.goals1, goalsBody.dataTypeId1)

    if (axes.length === 2) {
        tracking.goalAchived2 = changeIncomingValue(tracking.goalAchived2, axes[1].dataTypeId)
    }

    return goalsBody
}

/**
 * Modify outgoing goals
 */
function changeOutgoingGoals(goals, dataTypeId) {
    for (const goal of goals) {
        goal = changeOutgoingValue(goal, dataTypeId)
    }

    return goal
}
