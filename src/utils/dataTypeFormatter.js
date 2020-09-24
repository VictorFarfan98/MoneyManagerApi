const { DATA_TYPES } = require('../components/Constants')

exports.changeOutgoingValue = function (value, dataTypeId) {
    switch (dataTypeId) {
        case DATA_TYPES.PERCENTAGE:
            //value = (value * 100).toFixed(2)
            break;
        default:
            break;
    }

    return value
}

exports.changeIncomingValue = function (value, dataTypeId) {
    switch (dataTypeId) {
        case DATA_TYPES.PERCENTAGE:
            //value = (value / 100).toFixed(2)
            break;
        default:
            break;
    }

    return value
}

