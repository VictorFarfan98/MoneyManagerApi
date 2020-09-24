exports.teamCreateSchema = {
    title: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Título"
    },
    parentTeamId: {
        type: "integer",
        required: false,
        displayName: "Equipo padre"
    },
    leaderId: {
        type: "integer",
        required: false,
        displayName: "Leader"
    },
    specialistId: {
        type: "integer",
        required: false,
        displayName: "Especialista"
    }
}

exports.addTeamMemberSchema = {
    userId: {
        type: "integer",
        required: true,
        displayName: "Usuario"
    },
    dataRoleId: {
        type: "integer",
        required: true,
        displayName: "Data Role"
    }
}

exports.teamUpdateSchema = {
    title: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 256
        },
        displayName: "Título"
    },
    parentTeamId: {
        type: "integer",
        required: false,
        displayName: "Equipo padre"
    },
    specialistId: {
        type: "integer",
        required: false,
        displayName: "Especialista"
    }
}

exports.teamAccountabilitySchema = {
    time: {
        type: "string",
        required: true,
        length: {
            min: 1,
            max: 8
        },
        displayName: "Hora"
    },
    day: {
        type: "integer",
        required: true,
        displayName: "Día"
    }
}