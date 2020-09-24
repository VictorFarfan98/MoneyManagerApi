const validator = require('validator');
const passwordValidator = require('password-validator');

class SchemaValidator {

    // JSON schema

    constructor(schema) {
        this.schema = schema
    }

    /**
   * Validates an object according to the schema provided in the constructor
   */
    validate(data) {
        let result = {
            isValid: true,
            messages: {}
        }
        try {
            let property
            for (property in this.schema) {
                let validationResult = this.validateProperty(property, data)
                if (!validationResult.isValid) {
                    result.isValid = (result.isValid && validationResult.isValid)
                    result.messages[property] = validationResult.messages
                }
            }
        } catch (error) {
            console.error(error)
        }
        console.log(`Validate: ${JSON.stringify(result)}`)
        return result
    }

    validateProperty(property, data) {
        let result = {
            isValid: true,
            messages: []
        }
        try {
            let propValue = this.schema[property]

            let validationResult
            switch (propValue.type) {
                case "string":
                    validationResult = this.validateString(property, data)
                    break;
                case "integer":
                    validationResult = this.validateInteger(property, data)
                    break;
                case "decimal":
                    validationResult = this.validateDecimal(property, data)
                    break;
                case "boolean":
                    validationResult = this.validateBoolean(property, data)
                    break;
                case "array":
                    validationResult = this.validateArray(property, data)
                    break;
                default:
                    break;
            }
            if (validationResult) {
                result.isValid = validationResult.isValid
                result.messages = validationResult.messages
                result.innerValidation = validationResult.innerValidation
            }
        } catch (error) {
            console.log(error)
        }
        return result
    }

    validateArrayElement(schema, data) {
        let result = {
            isValid: true,
            messages: []
        }
        try {
            let validationResult
            switch (schema.type) {
                case "string":
                    validationResult = this.validateString(null, data, schema)
                    break;
                case "integer":
                    validationResult = this.validateInteger(null, data, schema)
                    break;
                case "decimal":
                    validationResult = this.validateDecimal(null, data, schema)
                    break;
                case "boolean":
                    validationResult = this.validateBoolean(null, data, schema)
                    break;
                case "array":
                    validationResult = this.validateArray(null, data, schema, data)
                    break;
                default:
                    break;
            }
            if (validationResult) {
                result.isValid = validationResult.isValid
                result.messages = validationResult.messages
            }
        } catch (error) {
            console.error(error)
        }
        
        return result
    }

    /**
   * Validates an string property according to the schema provided in the constructor
   */
    validateString(property, data, schema) {
        let result = {
            isValid: true,
            messages: []
        }
        try {

            if (!schema) {
                schema = this.schema[property]
            }

            // Validate custom functions
            let validationResult = this.validateCustomRules(property, data, schema)
            result.isValid = (result.isValid && validationResult.isValid)
            result.messages = validationResult.messages

            // Validate required
            if (!data[property] && data[property] !== 0) {
                if (schema.required) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} es requerido`)
                }
                return result
            }

            // Validate data type
            if (!(typeof data[property] === 'string' || data[property] instanceof String)) {
                result.isValid = false
                result.messages.push(`'El campo ${schema.displayName}debe ser una Cadena`)

                return result
            }

             // Validate length
             if (schema.length) {
                if (schema.length.min) {
                    if (data[property].trim().length < schema.length.min) {
                        result.isValid = false
                        result.messages.push(`'El campo ${schema.displayName} debe tener una longitud mínima de ${schema.length.min}`)

                        return result
                    }
                }

                if (schema.length.max) {
                    if (data[property].trim().length > schema.length.max) {
                        result.isValid = false
                        result.messages.push(`'El campo ${schema.displayName} debe tener una longitud máxima de ${schema.length.max}`)

                        return result
                    }
                }
            }

            // Validate email
            if (schema.isEmail) {
                //const regexEmail = /\S+@\S+\.\S+/
                if (!validator.isEmail(data[property])) {
                    result.isValid = false
                    result.messages.push(`El campo ${schema.displayName} debe ser un correo válido`)
                }
            }

            // Validate url
            if (schema.isURL) {
                //const regexEmail = /\S+@\S+\.\S+/
                if (!validator.isURL(data[property])) {
                    result.isValid = false
                    result.messages.push(`El campo ${schema.displayName} debe ser una URL válida`)
                }
            }

            // Validate password
            if (schema.isPassword) {
                let passwordSchema = new passwordValidator();

                // Add properties to it
                passwordSchema
                    .is().min(8)                                    // Minimum length 8
                    .has().uppercase()                              // Must have uppercase letters
                    .has().lowercase()                              // Must have lowercase letters
                    .has().digits()                                 // Must have digits

                if (!passwordSchema.validate(data[property])) {
                    result.isValid = false
                    result.messages.push(`El campo ${schema.displayName} es una contraseña demasiado débil`)
                }
            }
        } catch (error) {
            console.error(error)
        }
        return result
    }

    /**
   * Validates an integer property according to the schema provided in the constructor
   */
    validateInteger(property, data, schema) {
        let result = {
            isValid: true,
            messages: []
        }
        try {

            if (!schema) {
                schema = this.schema[property]
            }

            // Validate custom functions
            let validationResult = this.validateCustomRules(property, data, schema)
            result.isValid = (result.isValid && validationResult.isValid)
            result.messages = validationResult.messages

            // Validate required
            if (!data[property] && data[property] !== 0) {
                if (schema.required) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} es requerido`)
                }
                return result
            }

            // Validate data type
            if (data[property] !== parseInt(data[property], 10)) {
                result.isValid = false
                result.messages.push(`'El campo ${schema.displayName} debe ser un integer`)

                return result
            }

            // Validate length
            if (schema.min) {
                if (data[property] < schema.min) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} no debe ser menor a ${schema.min}`)

                    return result
                }
            }

            if (schema.max) {
                if (data[property] > schema.max) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} no debe ser mayor a ${schema.max}`)

                    return result
                }
            }
        } catch (error) {
            console.error(error)
        }
        return result
    }

    /**
   * Validates an decimal property according to the schema provided in the constructor
   */
    validateDecimal(property, data, schema) {
        let result = {
            isValid: true,
            messages: []
        }
        let value = data
        if (property) {
            value = data[property]
        }
        try {

            if (!schema) {
                schema = this.schema[property]
            }

            // Validate custom functions
            let validationResult = this.validateCustomRules(property, data, schema)
            result.isValid = (result.isValid && validationResult.isValid)
            result.messages = validationResult.messages

            // Validate required
            if (!value && value !== 0) {
                if (schema.required) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} es requerido`)
                }
                return result
            }

            // Validate data type
            if (typeof value !== 'number') {
                result.isValid = false
                result.messages.push(`'El campo ${schema.displayName} debe ser un número`)

                return result
            }

            // Validate length
            if (schema.min) {
                if (value < schema.min) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} no debe ser menor a ${schema.min}`)

                    return result
                }
            }

            if (schema.max) {
                if (value > schema.max) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} no debe ser mayor a ${schema.max}`)

                    return result
                }
            }
        } catch (error) {
            console.error(error)
        }
        return result
    }

    /**
   * Validates an boolean property according to the schema provided in the constructor
   */
    validateBoolean(property, data, schema) {
        let result = {
            isValid: true,
            messages: []
        }
        try {

            if (!schema) {
                schema = this.schema[property]
            }

            // Validate custom functions
            let validationResult = this.validateCustomRules(property, data, schema)
            result.isValid = (result.isValid && validationResult.isValid)
            result.messages = validationResult.messages

            // Validate required
            if (data[property] === null || data[property] === undefined) {
                if (schema.required) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} es requerido`)
                }
                return result
            }

            // Validate data type
            if (typeof data[property] !== 'boolean') {
                result.isValid = false
                result.messages.push(`'El campo ${schema.displayName} debe ser un boolean`)

                return result
            }
        } catch (error) {
            console.error(error)
        }
        return result
    }

    /**
   * Validates an array property according to the schema provided in the constructor
   */
    validateArray(property, data, schema) {
        let result = {
            isValid: true,
            messages: [],
            innerValidation: {}
        }
        try {

            if (!schema) {
                schema = this.schema[property]
            }

            // Validate custom functions
            let validationResult = this.validateCustomRules(property, data, schema)
            result.isValid = (result.isValid && validationResult.isValid)
            result.messages = validationResult.messages

            // Validate required
            if (data[property] === null || data[property] === undefined) {
                if (schema.required) {
                    result.isValid = false
                    result.messages.push(`'El campo ${schema.displayName} es requerido`)
                }
                return result
            }

            // Validate data type
            if (!Array.isArray(data[property])) {
                result.isValid = false
                result.messages.push(`'El campo ${schema.displayName} debe ser unn array`)

                return result
            }

            // Validate data type
            if (!Array.isArray(data[property])) {
                result.isValid = false
                result.messages.push(`'El campo ${schema.displayName} debe ser unn array`)

                return result
            }

            // Validate length
            if (schema.length) {
                if (schema.length.min) {
                    if (data[property].length < schema.length.min) {
                        result.isValid = false
                        result.messages.push(`'El campo ${schema.displayName} debe tener una longitud mínima de ${schema.length.min}`)

                        return result
                    }
                }

                if (schema.length.max) {
                    if (data[property].length > schema.length.max) {
                        result.isValid = false
                        result.messages.push(`'El campo ${schema.displayName} debe tener una longitud máxima de ${schema.length.max}`)

                        return result
                    }
                }
            }

            if (schema.hasOwnProperty('innerSchema')) {

                let innerValidator = new SchemaValidator(schema.innerSchema)

                let element
                let index = 0
                console.debug(data[property])
                for (element of data[property]) {
                    let tempResult
                    switch (schema.innerSchema.type) {
                        case 'object':
                            tempResult = innerValidator.validate(element)
                            break;
                        default:
                            tempResult = this.validateArrayElement(schema.innerSchema, element)
                            break;
                    }
                    console.debug(element)
                    console.debug(tempResult)
                    if (!tempResult.isValid) {
                        result.isValid = (result.isValid && tempResult.isValid)
                        result.innerValidation[`${index}`] = tempResult
                    }else{
                        result.innerValidation[`${index}`] = {
                            isValid : true
                        }
                    }
                    index++
                }
            }
        } catch (error) {
            console.error(error)
        }
        return result
    }

    /**
   * Validates the custom rules for a property
   */
    validateCustomRules(property, data, schema) {
        let result = {
            isValid: true,
            messages: []
        }
        try {

            let value = data
            if (property) {
                value = data[property]
            }

            if (!schema) {
                schema = this.schema[property]
            }

            // Validate required
            if (schema.customRules) {
                schema.customRules.forEach(customRule => {
                    let validation = customRule.rule(data, value)
                    if (!validation) {
                        result.isValid = false
                        result.messages.push(customRule.message)
                    }
                });
            }

        } catch (error) {
            console.error(error)
        }
        return result
    }
}

module.exports = SchemaValidator