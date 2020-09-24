const ACTIVE_RECORD = 10
const PROJECT_STATUS_OK = ACTIVE_RECORD
const BULK_MAX_SIZE = 500
const DEFAULT_CONNECTION_LIMIT = 10
const BULK_PAGE_SIZE = 1000 // "page size"
const UI_PAGE_SIZE = 20
const ACQUIRE_TIME_OUT = 60 * 60 * 1000

const DATA_TYPES = {
  NUMERIC: 1,
  PERCENTAGE: 2
}

const ROLES = {
  "SuperAdmin": {
      id: 1,
      name: "SuperAdmin"
  },
  "Admin": {
      id: 2,
      name: "Admin"
  },
  "User": {
      id: 3,
      name: "User"
  },
  "Guest": {
      id: 4,
      name: "Guest"
  }
}

const RESPONSE_MESSAGES = {
  'INVALID_TOKEN': 'INVALID_TOKEN',
  'ROLE_REQUIRED': 'ROLE_REQUIRED'
}

const PERMISSIONS = {
  'CREATE': 'create',
  'UPDATE': 'update',
  'READ': 'read',
  'DELETE': 'delete',
  'TRACK': 'track',
  'ADD_MEMBER': 'addMember',
  'DELETE_MEMBER': 'deleteMember'
}

module.exports = { ACTIVE_RECORD,
  PROJECT_STATUS_OK,
  BULK_MAX_SIZE,
  DEFAULT_CONNECTION_LIMIT,
  BULK_PAGE_SIZE,
  UI_PAGE_SIZE,
  ACQUIRE_TIME_OUT,
  DATA_TYPES,
  ROLES,
  RESPONSE_MESSAGES,
  PERMISSIONS
}
