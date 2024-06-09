class UserExistException extends Error{
    constructor(message){
        super(message)
    }
}

module.exports = UserExistException