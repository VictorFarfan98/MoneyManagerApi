const config = require('../load/config.json')
const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const responses = require('../utils/responses')
const createError = require('http-errors')
const { ROLES, RESPONSE_MESSAGES } = require('../components/Constants')
const jwtDecode = require('jwt-decode')

const wigManagement = require('../controllers/v1/wigManagement')
const trackingManagement = require('../controllers/v1/trackingManagement')
const predictiveMgt = require('../controllers/v1/predictiveManagement')
const teamMgt = require('../controllers/v1/teamManagement')
const commitmentMgt = require('../controllers/v1/commitmentManagement')
const historyMgt = require('../controllers/v1/historyManagement')
const questionsMgt = require('../controllers/v1/questionsManagement')

const checkJwt = (req, res, next) => {


  const handleErrorNext = (err) => {
    if (err) {
      next(createError(401, RESPONSE_MESSAGES.INVALID_TOKEN))
    } else {
      next()
    }
  }
  const middleware = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.AUTH0_JKSURI
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256']
  })

  middleware(req, res, handleErrorNext)
}

const authorize = (roles = []) => {
  if (!Array.isArray(roles)) {
    roles = [roles]
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    (req, res, next) => {
      checkJwt(req, res, next)
    },
    // authorize based on user role
    (req, res, next) => {
      try {
        // get the roles of the user
        const authorizationArray = req.headers.authorization.split(' ')
        const tokenPayload = jwtDecode(authorizationArray[1])
        const tokenRoles = tokenPayload["https://alliedits/roles"]
        // check if the user has the role
        if (roles && roles.length) {
          if (!roles.some(role => tokenRoles.includes(role.name))) {
            // user's role is not authorized
            next(createError(401, RESPONSE_MESSAGES.ROLE_REQUIRED))
            return
          }
        }
        // Acces granted
        next()
      } catch (error) {
        console.error(error)
        next(createError(500))
      }
    }
  ];
}


// Get WIGs by Id
router.get('/v1/wig/:wigId', authorize(), wigManagement.getWIGById)
// Get WIGs by TeamId
router.get('/v1/team/:teamId/wig', authorize(), wigManagement.getWIGByTeam)
// Post WIG
router.post('/v1/team/:teamId/wig', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), wigManagement.saveWIG)
// Put WIG
router.put('/v1/wig/:wigId', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), wigManagement.updateWIG)
// Delete WIG
router.delete('/v1/wig/:wigId', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), wigManagement.deleteWIG)

// Post WIG Tracking
router.post('/v1/wig/:wigId/tracking', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), wigManagement.saveWIGTracking)
// Post predictive Tracking
router.post('/v1/predictive/:predictiveId/tracking', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), predictiveMgt.savePredictiveTracking)
// Get Tracking by Axis Id
router.get('/v1/axis/:axisId/tracking', authorize(), trackingManagement.getTrackingByAxisId)

// Get WIG Goals
router.get('/v1/wig/:wigId/goals', authorize(), wigManagement.getWIGGoalsById)
// Get Save WIG Goals
router.put('/v1/wig/:wigId/goals', authorize(), wigManagement.saveWIGGoals)

// Get Predictive by Id
router.get('/v1/predictive/:predictiveId', authorize(), predictiveMgt.getPredictiveById)
// Get Predictive by WIG Id
router.get('/v1/wig/:wigId/predictive/', authorize(), predictiveMgt.getPredictiveByWIGId)
// Post Predictive
router.post('/v1/wig/:wigId/predictive/', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), predictiveMgt.savePredictive)
// Put Predictive
router.put('/v1/predictive/:predictiveId', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), predictiveMgt.updatePredictive)
// Delete Predictive
router.delete('/v1/predictive/:predictiveId', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), predictiveMgt.deletePredictive)

// Create Team
router.post('/v1/team/', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), teamMgt.saveTeam)
// Update Team
router.put('/v1/team/:teamId', authorize([ROLES.SuperAdmin, ROLES.Admin]), teamMgt.updateTeam)
// Delete Team
router.delete('/v1/team/:teamId', authorize([ROLES.SuperAdmin, ROLES.Admin]), teamMgt.deleteTeam)
// Add Team Member
router.post('/v1/team/:teamId/users', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), teamMgt.saveTeamMember)
// Get members of a team
router.get('/v1/team/:teamId/users', authorize(), teamMgt.getTeamMembers)
// Update Team Accountability
router.put('/v1/team/:teamId/accountability', authorize(), teamMgt.updateTeamAccountability)
// Delete User from Team
router.delete('/v1/team/:teamId/user/:userId', authorize([ROLES.SuperAdmin, ROLES.Admin]), teamMgt.deleteUserFromTeam)

// Get Teams by user Id
router.get('/v1/user/team/', authorize(), teamMgt.getTeamsByUserId)
// Get All Teams
router.get('/v1/team/', authorize(), teamMgt.getAllTeams)
// Get All Team Accountability
router.get('/v1/team/accountability', authorize(), teamMgt.getTeamBySpecialist)
// Get All Teams
router.get('/v1/team/:teamId', authorize(), teamMgt.getTeamById)

// Get Commitments for Team
router.get('/v1/team/:teamId/commitment', authorize(), commitmentMgt.getCommitmentByTeamId)
// Get Commitments by Id
router.get('/v1/team/:teamId/wig/:wigId/commitment/commitmentId/:commitmentId', authorize(), commitmentMgt.getCommitmentById)
// Save commitment
router.post('/v1/team/:teamId/wig/:wigId/commitment', authorize(), commitmentMgt.saveCommitment)
// Delete Commitment
router.delete('/v1/team/:teamId/wig/:wigId/commitment/:commitmentId', authorize(), commitmentMgt.deleteCommitment)
// Get Commitments Tracking
router.post('/v1/team/:teamId/wig/:wigId/commitment/:commitmentId/tracking', authorize(), commitmentMgt.saveCommitmentTracking)
// Get External Commitments for User
router.get('/v1/user/commitment/external', authorize(), commitmentMgt.getExternalCommitments)

// Accountability Records
// Get all questions
router.get('/v1/accountability/questions', authorize(), questionsMgt.getAllQuestions)
// put Save questions grades
router.post('/v1/accountabilityrecord/team/:teamId', authorize([ROLES.SuperAdmin, ROLES.Admin, ROLES.User]), questionsMgt.saveAccountabilityRecord)
// Get Ac.Records list by team
router.get('/v1/accountability/records/team/:teamId', authorize(), questionsMgt.getRecordsbyTeam)
// Get Ac.Record by id
router.get('/v1/accountability/record/:recordId', authorize(), questionsMgt.getRecordbyId)
// Get Ac.Record Participants by id
router.get('/v1/accountability/record/:recordId/participants', authorize(), questionsMgt.getParticipantsbyRecordId)

// Get All Logs
router.get('/v1/history/all', authorize(), historyMgt.getLogs)

router.get('/healthcheck', (req, res) => {
  res.status(200).json(responses.webResponse(true, 'Health check ok'))
})

module.exports = router
