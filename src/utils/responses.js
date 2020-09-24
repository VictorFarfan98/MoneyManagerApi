
exports.webResponse = (success, message, token) => {
  let responseObj
  if (success) {
    responseObj = {
      success: success,
      payload: message
    }
  } else {
    responseObj = {
      success: success,
      error: message,
      token: token || false
    }
  }
  return responseObj
}


/**
 * Contains information of list
 * Group By: param
 */
exports.getTableResult = (value) => {
  try {
    let spResult
    let header = []
    let result = []

    if (typeof (value) !== 'object' || value.constructor !== Array) throw new Error('Expected an array')

    if (value.length > 0) {
      for (var propertyName in value[0]) {
        header.push(propertyName)
      }
    }

    result = value
    spResult = {
      header: header,
      result: result
    }

    return spResult
  } catch (error) {
    throw error
  }
}