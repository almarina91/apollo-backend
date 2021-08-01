const ERROR = {
    invalidUpdate: 'invalid update',
    planNotFound: 'plan not found',
    unableToLogin: 'unable to login',
    onlyAdmin: 'only admin area',
    authenticate:'please authenticate',
    strongerPassword: 'please provide a stronger password of minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol',
    invalidEmail: 'invalid email'
}

const ROLE = {
    admin: 'admin'
}

const STATUS_CODE = {
    unauthorized: 401,
    created: 201,
    badRequest:400,
    ok:200,
    serverError: 500
}

const MESSAGE={
    success: 'success!'
}

module.exports = {ERROR, ROLE, STATUS_CODE, MESSAGE};