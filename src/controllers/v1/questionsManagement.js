const responses = require('../../utils/responses')
const security = require('../../utils/security')
const createError = require('http-errors')
const questionsRepository = require('../../services/questionsRepository')
const authorizationRepo = require('../../services/authorizationRepository')
const teamModel = require('../../models/teamModel')
const { validateModel } = require('../../utils/validator')
const { RESPONSE_MESSAGES, PERMISSIONS } = require('../../components/Constants')


/**
 * Get all questions
 */
exports.getAllQuestions = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {}

        result = await questionsRepository.getAllQuestions(params)
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
 * 
 * Save accoutnability record which includes record, and questions. 
 */
exports.saveAccountabilityRecord = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
        next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
        return
        }
            
        console.debug(req.params);
        console.debug(req.body);

        params = {
            notes: JSON.stringify(req.body.notes),
            grades: JSON.stringify(req.body.grades),
            participants: JSON.stringify(req.body.participants),
            questions: JSON.stringify(req.body.questions),
            teamId: req.params.teamId
        }
  
        console.debug(params);
        result = await questionsRepository.saveAcQuestions(params)

        if (result) {
            res.status(201).json('Result');
        }
  
    } catch (error) {
      console.error(error)
      next(createError(500))
    }
}

/**
 * Get all record by team
 */
exports.getRecordsbyTeam = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            teamId: req.params.teamId
        }

        result = await questionsRepository.getRecordsbyTeam(params)
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
 * Get record details by record id
 */
exports.getRecordbyId = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            recordId: req.params.recordId
        }

        result = await questionsRepository.getRecordbyId(params)
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
 * Get record details by record id
 */
exports.getParticipantsbyRecordId = async (req, res, next) => {
    try {
        // Validate security
        if (!security.validateNonceAES(req.headers.nonce)) {
            next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
            return
        }

        let params = {
            recordId: req.params.recordId
        }

        result = await questionsRepository.getParticipantsbyRecordId(params)
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