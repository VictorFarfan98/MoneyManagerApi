const { main } = require('../components/regularConnection')
const { executeSpWithConn } = require('../components/customRepository')

/**
 * Group of queries to execute
 */
let historyRepository = function () {
    let getLogs = async (params) => {
        return await executeSpWithConn(main, `Log_GetLogs()`, params)
    }

    return {
        getLogs: getLogs
    }
}

module.exports = historyRepository()
