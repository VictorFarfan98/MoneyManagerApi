exports.wigCreateSchema = {
    verb: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Verbo"
    },
    what: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Qué?"
    },
    year: {
        type: "integer",
        required: true,
        displayName: "Año"
    },
    description: {
        type: "string",
        required: false,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Descripción"
    },
    axesNumber: {
        type: "decimal",
        required: true,
        max: 2,
        min: 1,
        displayName: "Número de ejes"
    },
    x1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "X1"
    },
    y1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Y1"
    },
    level1_1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 1 Eje 1"
    },
    level2_1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 2 Eje 1"
    },
    level3_1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 3 Eje 1"
    },
    dataTypeId1: {
        type: "integer",
        required: true,
        displayName: "Tipo de dato 1"
    },
    displayName1: {
        type: "string",
        required: true,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Nombre eje 1"
    },
    x2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "X2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.x2 === "" || data.x2 === undefined || data.x2 === null)
                }
                return isValid
            },
            message: `El campo X es obligatorio`
        }
        ]
    },
    y2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Y2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.y2 === "" || data.y2 === undefined || data.y2 === null)
                }
                return isValid
            },
            message: `El campo Y es obligatorio`
        }
        ]
    },
    level1_2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 1 Eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.level1_2 === "" || data.level1_2 === undefined || data.level1_2 === null)
                }
                return isValid
            },
            message: `El campo Nivel 1 Eje 2`
        }
        ]
    },
    level2_2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 1 Eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.level2_2 === "" || data.level2_2 === undefined || data.level2_2 === null)
                }
                return isValid
            },
            message: `El campo Nivel 2 Eje 2`
        }
        ]
    },
    level3_2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 3 Eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.level3_2 === "" || data.level3_2 === undefined || data.level3_2 === null)
                }
                return isValid
            },
            message: `El campo Nivel 3 Eje 2`
        }
        ]
    },
    dataTypeId2: {
        type: "integer",
        required: false,
        displayName: "Tipo de dato 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.dataTypeId2 === "" || data.dataTypeId2 === undefined || data.dataTypeId2 === null)
                }
                return isValid
            },
            message: `El campo tipo de MCI es obligatorio`
        }
        ]
    },
    displayName2: {
        type: "string",
        required: false,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Nombre eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.displayName2 === "" || data.displayName2 === undefined || data.displayName2 === null)
                }
                return isValid
            },
            message: `El campo nombre del eje es obligatorio`
        }
        ]
    }
}

exports.wigTrackingSchema = {
    month: {
        type: "integer",
        required: true,
        max: 12,
        min: 1,
        displayName: "Mes"
    },
    axesNumber: {
        type: "integer",
        required: true,
        displayName: "Cantidad de ejes"
    },
    goalAchived1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Meta alcanzada 1"
    },
    goalAchived2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Meta alcanzada 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.goalAchived2 === "" || data.goalAchived2 === undefined || data.goalAchived2 === null)
                }
                return isValid
            },
            message: `El campo Meta alcanzada 2 es requerido`
        }
        ]
    },
    commentary1: {
        type: "string",
        required: false,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Comentario 1"
    },
    commentary2: {
        type: "string",
        required: false,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Comentario 2"
    }
}

exports.wigUpdateSchema = {
    verb: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Verbo"
    },
    what: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Qué?"
    },
    description: {
        type: "string",
        required: false,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Descripción"
    },
    x1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "X1"
    },
    y1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Y1"
    },
    level1_1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 1 Eje 1"
    },
    level2_1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 2 Eje 1"
    },
    level4_1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 3 Eje 1"
    },
    dataTypeId1: {
        type: "integer",
        required: true,
        displayName: "Tipo de dato 1"
    },
    displayName1: {
        type: "string",
        required: true,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Nombre eje 1"
    },
    x2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "X2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.x2 === "" || data.x2 === undefined || data.x2 === null)
                }
                return isValid
            },
            message: `El campo X es obligatorio`
        }
        ]
    },
    y2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Y2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.y2 === "" || data.y2 === undefined || data.y2 === null)
                }
                return isValid
            },
            message: `El campo Y es obligatorio`
        }
        ]
    },
    level1_2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 1 Eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.level1_2 === "" || data.level1_2 === undefined || data.level1_2 === null)
                }
                return isValid
            },
            message: `Nivel 1 Eje 2 es obligatorio`
        }
        ]
    },
    level2_2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 2 Eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.level2_2 === "" || data.level2_2 === undefined || data.level2_2 === null)
                }
                return isValid
            },
            message: `Nivel 2 Eje 2 es obligatorio`
        }
        ]
    },
    level3_2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Nivel 3 Eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.level3_2 === "" || data.level3_2 === undefined || data.level3_2 === null)
                }
                return isValid
            },
            message: `Nivel 3 Eje 2 es obligatorio`
        }
        ]
    },
    dataTypeId2: {
        type: "integer",
        required: false,
        displayName: "Tipo de dato 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.dataTypeId2 === "" || data.dataTypeId2 === undefined | data.dataTypeId2 === null)
                }
                return isValid
            },
            message: `El campo tipo de MCI es obligatorio`
        }
        ]
    },
    displayName2: {
        type: "string",
        required: false,
        length: {
            min: 0,
            max: 256
        },
        displayName: "Nombre eje 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.displayName2 === "" || data.displayName2 === undefined || data.displayName2 === null)
                }
                return isValid
            },
            message: `El campo nombre del eje es obligatorio`
        }
        ]
    }
}

exports.wigGoalsSchema = {
    goals1: {
        type: "array",
        required: true,
        displayName: "Metas 1",
        min: 1,
        max: 12
    },
    goals2: {
        type: "array",
        required: false,
        displayName: "Metas 2",
        min: 1,
        max: 12
    }
}