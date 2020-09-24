const responses = require('../../utils/responses')
const security = require('../../utils/security')
const createError = require('http-errors')
const trackingRepository = require('../../services/trackingRepository')
const authorizationRepo = require('../../services/authorizationRepository')
const { changeOutgoingValue } = require('../../utils/dataTypeFormatter')
const { RESPONSE_MESSAGES, PERMISSIONS } = require('../../components/Constants')

/**
 * Get tracking list filter
 */
exports.getTrackingByAxisId = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            pUserId: security.userId,
            pAction: PERMISSIONS.READ,
            pAxisId: req.params.axisId
        }

        let result = await authorizationRepo.authorizeAxis(params)

        if (!result[0][0].hasPermission) {
            next(createError(401,  RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
        }

        params = {
            pAxisId: req.params.axisId
        }

        result = await trackingRepository.getTrackingByAxisId(params)

        if (!Array.isArray(result)) {
            console.error(err)
            next(createError(500))
        } else {
            // Act on goals according to the data type
            result = changeOutgoingTracking(result[0])
            res.json(responses.getTableResult(result))
        }
    } catch (error) {
        console.error(error)
        next(createError(500))
    }
}

/**
 * Modify outgoing tracking list
 */
function changeOutgoingTracking(trackingList) {
    // Act on numeric fields according to the data type
    trackingList.forEach(tracking => {
        tracking.y = changeOutgoingValue(tracking.y, tracking.dataTypeId)
        tracking.goalAchived = changeOutgoingValue(tracking.goalAchived, tracking.dataTypeId)
        tracking.difference = changeOutgoingValue(tracking.difference, tracking.dataTypeId)
    })
    return trackingList
}
