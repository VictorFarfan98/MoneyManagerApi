const responses = require('../../utils/responses')
const security = require('../../utils/security')

const createError = require('http-errors')
const historyRepo = require('../../services/historyRepository')


const { RESPONSE_MESSAGES } = require('../../components/Constants')
/**
 * Get History Logs
 */
exports.getLogs = async (req, res, next) => {
    try {
        // Validate security

        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
        }


        result = await historyRepo.getLogs(params)
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
