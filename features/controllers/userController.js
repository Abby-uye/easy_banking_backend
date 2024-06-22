const {registerBankUser,verify,resendCode} = require("../services/bankUserService")
const UserException = require("../exception/UserException");


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

const verifyUser = async (verifyUserRequest, verifyUserResponse) => {
    try {
        const verifyResponse = await verify(verifyUserRequest);
        verifyUserResponse.json(verifyResponse);
    } catch (error) {
        if (error instanceof UserException) {
           return  verifyUserResponse.status(error.statusCode).json({ error: error.message });
        }
        else {
            console.error(error, "internal server error");
          return   verifyUserResponse.status(500).json();

        }
    }
};


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