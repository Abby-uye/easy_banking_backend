const {registerBankUser,verify,resendCode} = require("../services/bankUserService")


const register = async(registerUserRequest,registerUserResponse) => {
    try {
        const registerResponse = await registerBankUser(registerUserRequest.body);
        registerUserResponse.json(registerResponse);
    } catch (error) {
        registerUserResponse.status(500).json({
            message: 'An error occurred during registration',
            error: error.message
        });

    }
}

const verifyUser = async (verifyUserRequest,verifyUserResponse)=>{
        try {
            const verifyResponse = await verify(verifyUserRequest);
            verifyUserResponse.json(verifyResponse)
        }
        catch (error){
            verifyUserResponse.status(500).json()
            console.log(error, "internal server error")
    }
}

const resendCodeToUser= async (resendCodeToUserRequest,resendCodeToUserResponse)=>{
    try {
        const resendResponse = await resendCode(resendCodeToUserRequest)
        resendCodeToUserResponse.json(resendResponse)
    }
    catch (error){
        resendCodeToUserResponse.status(500).json()
    }
}

module.exports = {register,verifyUser,resendCodeToUser}