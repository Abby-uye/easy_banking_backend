const {registerBankUser} = require("../services/bankUserService")


const register = async(request,response) => {
    try {
        const savedUser = await registerBankUser(request.body);
        response.status(200).json({
            message: 'User registered successfully',
            data: savedUser
        });
    } catch (error) {
        response.status(500).json({
            message: 'An error occurred during registration',
            error: error.message
        });
    }
}
module.exports = {register}