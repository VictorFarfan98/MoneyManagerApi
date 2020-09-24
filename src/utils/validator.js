const SchemaValidator = require('./SchemaValidator')

/**
 * Validates an object according to the model provided
 */
exports.validateModel = (model, data) => {
  let validationResult = {}
  // Validate output
  let validator = new SchemaValidator(model)
  let check = validator.validate(data)

  validationResult.isValid = check.isValid
  validationResult.errors = check.messages
  return validationResult
}
