
/**
 * Get the information for dataset 0
 * Contains information group by the given parameter
 * Group By: param
 */
exports.getGroupByField = (field, value) => {
  try {
    let spResult
    let header = []
    let result = []
    if (typeof (value) !== 'object' || value.constructor !== Array) throw new Error('Expected an array')
    header = [field, 'count']
    value.map((row) => {
      result.push({ name: (row[field] === '' ? 'Sin clasificar' : row[field]), value: row.count })
    })
    spResult = {
      header: header,
      [field]: result
    }
    return spResult
  } catch (error) {
    throw error
  }
}

/**
 * Get the json for dropdown values
 */
exports.getDropdownValues = (field, value) => {
  let spResult
  let values = []
  values.push({ name: 'Todos', id: '-1' })
  value.map((row) => {
    values.push({ name: (row[field] === '' ? 'Sin clasificar' : row[field]), id: row[field] })
  })
  spResult = {
    values
  }
  return spResult
}

/**
 * Get the json for challenges
 */
exports.getChallenges = (value) => {
  let spResult
  let challenges = []

  value.map((row) => {
    challenges.push({ name: `${row.name}`, id: row.id })
  })
  spResult = {
    challenges
  }
  return spResult
}

/**
 * Get the json for questions
 */
exports.getQuestions = (value) => {
  let spResult
  let questions = []
  value.map((row) => {
    questions.push({ text: `${row.question}`, id: row.id })
  })
  spResult = {
    questions
  }
  return spResult
}

/**
 * Get the json for count
 */
exports.getCount = (value) => {
  let spResult = value[0]
  return spResult
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
