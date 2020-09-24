exports.predictiveCreate = {
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
    focus: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Enfoque"
    },
    quality: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Calidad"
    },
    consistency: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Consistencia"
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
        type: "integer",
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
        displayName: "Punto medio 1",
        customRules:[
            {
                rule: function (data) {
                    let isValid = true
                    if(data.x1 !== "" && data.x1 !== null && data.x1 !== undefined){
                        if (data.y1 !== "" && data.y1 !== null && data.y1 !== undefined) {
                            if (data.dir1 === 1) {
                                isValid = data.x1 < data.y1
                            } else {
                                isValid = data.x1 > data.y1
                            }
                        }
                    }
                    return isValid
                },
                message: "El valor medio debe ser menor a la meta trazada"
            }
        ]
    },
    y1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Meta trazada 1"
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
    dir1: {
        type: "integer",
        required: true,
        max: 1,
        min: 0,
        displayName: "Dirección 1"
    },
    x2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Punto medio 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.x2 === "" || data.x2 === null || data.x2 === undefined)
                }
                return isValid
            },
            message: `El campo Punto medio 2 es obligatorio`
        },
        {
            rule: function (data) {
                let isValid = true
                if(data.x2 !== "" && data.x2 !== null && data.x2 !== undefined){
                    if (data.y2 !== "" && data.y2 !== null && data.y2 !== undefined) {
                        if (data.dir2 === 1) {
                            isValid = data.x2 < data.y2
                        } else {
                            isValid = data.x2 > data.y2
                        }
                    }
                }
                return isValid
            },
            message: "El valor medio debe ser menor a la meta trazada"
        }
        ]
    },
    y2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Meta trazada 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.y2 === "" || data.y2 === undefined)
                }
                return isValid
            },
            message: `El campo Meta trazada 2 es obligatorio`
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
                    isValid = !(data.dataTypeId2 === "" || data.dataTypeId2 === undefined)
                }
                return isValid
            },
            message: `El campo tipo de predictiva es obligatorio`
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
                    isValid = !(data.displayName2 === "" || data.displayName2 === undefined)
                }
                return isValid
            },
            message: `El campo nombre del eje es obligatorio`
        }]
    },
    dir2: {
        type: "integer",
        required: false,
        displayName: "Dirección 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.dir2 === "" || data.dir2 === undefined || data.dir2 === null)
                }
                return isValid
            },
            message: `El campo dirección 2 es obligatorio`
        }
    ]
    },
}

exports.predictiveTrackingSchema = {
    week: {
        type: "integer",
        required: true,
        max: 52,
        min: 1,
        displayName: "Semana"
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

exports.predictiveUpdateSchema = {
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
    focus: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Enfoque"
    },
    quality: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Calidad"
    },
    consistency: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Consistencia"
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
        displayName: "Punto medio 1",
        customRules:[
            {
                rule: function (data) {
                    let isValid = true
                    if(data.x1 !== "" && data.x1 !== null && data.x1 !== undefined){
                        if (data.y1 !== "" && data.y1 !== null && data.y1 !== undefined) {
                            if (data.dir1 === 1) {
                                isValid = data.x1 < data.y1
                            } else {
                                isValid = data.x1 > data.y1
                            }
                        }
                    }
                    return isValid
                },
                message: "El valor medio debe ser menor a la meta trazada"
            }
        ]
    },
    y1: {
        type: "decimal",
        required: true,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Meta trazada 1"
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
    dir1: {
        type: "integer",
        required: true,
        max: 1,
        min: 0,
        displayName: "Dirección 1"
    },
    x2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Punto medio 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.x2 === "" || data.x2 === undefined || data.x2 === null)
                }
                return isValid
            },
            message: `El campo Punto medio 2 es obligatorio`
        },
        {
            rule: function (data) {
                let isValid = true
                if(data.x2 !== "" && data.x2 !== null && data.x2 !== undefined){
                    if (data.y2 !== "" && data.y2 !== null && data.y2 !== undefined) {
                        if (data.dir2 === 1) {
                            isValid = data.x2 < data.y2
                        } else {
                            isValid = data.x2 > data.y2
                        }
                    }
                }
                return isValid
            },
            message: "El valor medio debe ser menor a la meta trazada"
        }
        ]
    },
    y2: {
        type: "decimal",
        required: false,
        max: 9999999999.99,
        min: -9999999999.99,
        displayName: "Meta trazada 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.y2 === "" || data.y2 === undefined || data.y2 === null)
                }
                return isValid
            },
            message: `El campo Meta trazada 2 es obligatorio`
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
            message: `El campo tipo de predictiva es obligatorio`
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
        }]
    },
    dir2: {
        type: "integer",
        required: false,
        displayName: "Dirección 2",
        customRules: [{
            rule: function (data) {
                let isValid = true
                if (data.axesNumber !== 1) {
                    isValid = !(data.dir2 === "" || data.dir2 === undefined || data.dir2 === null)
                }
                return isValid
            },
            message: `El campo dirección 2 es obligatorio`
        }
    ]
    },
}