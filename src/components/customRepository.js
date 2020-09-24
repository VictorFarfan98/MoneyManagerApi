let AWSXRay = require('aws-xray-sdk')
const util = require('util')

exports.executeSp = function (pool, storedProcedure, params, callback) {
  // Get array of parameters from object
  let paramsArray = Object.keys(params).reduce((array, key) => {
    array.push(params[key])
    return array
  }, [])
  // Execute stored procedure call
  AWSXRay.captureAsyncFunc('Query', (subsegment) => {
    pool.query(`CALL ${storedProcedure}`, paramsArray, (err, result) => {
      if (subsegment) subsegment.close()
      if (err) {
        console.error(err)
        callback(new Error('Algo salió mal, por favor intentalo de nuevo.'))
      } else {
        callback(undefined, result)
      }
    })
  })
}

exports.executeSpWithConn = async (conn, storedProcedure, params) => {
  try {
    // node native promisify
    const query = util.promisify(conn.query).bind(conn)
    
    // Get array of parameters from object
    let paramsArray = Object.keys(params).reduce((array, key) => {
      array.push(params[key])
      return array
    }, [])
    // Execute stored procedure call
    let result = await query(`CALL ${storedProcedure}`, paramsArray)

    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}
