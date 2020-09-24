exports.commitmentCreateSchema = {
    title: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 512
        },
        displayName: "Título"
    },
    hasDependency: {
        type: "boolean",
        required: true,
        displayName: "Existe despeje?"
    },
    dependencyUser: {
        type: "integer",
        required: false,
        displayName: "Usuario que se solicita ayuda?",
        customRules:[
            {
                rule: function (data) {
                    let isValid = true
                    if(data.hasDependency){
                        isValid = !(data.dependencyUser === null || data.dependencyUser === undefined)
                    }
                    
                    return isValid
                },
                message: "El usuario al que se solicita ayuda es requerido"
            }
        ]
    },
    applyForAllMembers: {
        type: "boolean",
        required: true,
        displayName: "Aplica para todos?"
    },
    assignedUser: {
        type: "integer",
        required: false,
        displayName: "Usuario asignado",
        customRules:[
            {
                rule: function (data) {
                    let isValid = true
                    if(!data.applyForAllMembers){
                        isValid = !(data.assignedUser === null || data.assignedUser === undefined)
                    }
                    
                    return isValid
                },
                message: "El usuario asignado es requerido"
            }
        ]
    },
}

exports.commitmentTrackingSchema = {
    commentary: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Comentario"
    },
    isDone: {
        type: "boolean",
        required: true,
        displayName: "Terminado?"
    },
    isClosed: {
        type: "boolean",
        required: false,
        displayName: "Cerrado?"
    }
}