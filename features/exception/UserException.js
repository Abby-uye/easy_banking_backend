class UserException extends Error{
    constructor(message){
        super(message)
    }
}

module.exports = UserException