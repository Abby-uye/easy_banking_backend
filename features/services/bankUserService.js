bankUser =  require("../data/models/bankUser")
const UserExistException = require("../exception/userExistException");
const UserException = require("../exception/userException");
const {sendWelcomeEmail} = require("../utils/nodeMailer");
const generator = require("../utils/generator")
const {hashPassword}= require("../utils/passwordHasher")



const {userStatus} = require("../constants/userconstants");
const registerBankUser = async(registrationRequest)=>{
    let emailConfirmDigits = generator.generateRandomNumber()
   let expirationTime = Date.now() + 15 * 60 * 1000;
        const {firstName, lastName, email, password} = registrationRequest;
        const user = await bankUser.findOne({email});

        if (user) {
            throw new UserExistException("this email is already in use")
        }
    console.log('Received password:', password);
        if(!validPassword(password)){
            throw new Error("Password does not match criteria")
        }
    const hashedPassword = await hashPassword(password)
        const newBankUser = {
            firstName,
            lastName,
            email,
            password:hashedPassword,
            emailConfirmDigits,
            expirationTime

        }
        const savedUser = await bankUser.create(newBankUser)
        const response = {
            firstName: savedUser.firstName,
            lastName:savedUser.lastName,
            email: savedUser.email,
        }

        registerMailSender(email,firstName+lastName,emailConfirmDigits)
        return {
            data: response,
            message: "Registration successful"

        }


}
const validPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const result = passwordRegex.test(password);
    console.log('Password:', password);
    console.log('Validation result:', result);
    return result;
};
const registerMailSender = (email,fullName,emailConfirmDigits)=>{
   let subject= 'Welcome to the Easy Banking!'
     let  text= `Hello ${fullName},\n\nWelcome to the Easy Banking! We are glad to have you on board.\n\nPlease enter this 6 digits to confirm your email ${emailConfirmDigits}\n\nBest Regards,\nEasy Banking team`

    sendWelcomeEmail(email, fullName,emailConfirmDigits, subject, text)
}


const verify = async (verifyUserRequest, verifyUserResponse) => {
    const { email, verificationCode } = verifyUserRequest.body;


        const user = await bankUser.findOne({ email });


        if (!user) {
             verifyUserResponse.status(400).send('User not found');
        }


        if (Date.now() > user.expirationTime.getTime()) {
            console.log(user.expirationTime)
             throw new UserException("verification code expired");
        }

        console.log("Verification step reached");


        if (user.emailConfirmDigits === verificationCode) {
            console.log("Verification code matches");


            user.status = userStatus.AUTHENTICATED;


            await user.save();

            return 'Registration complete';
        } else {
           throw new Error("Invalid verification code")
        }

};





const resendCode = async (req, res) => {
    const { email } = req.body;
    const user = await bankUser.findOne({email});

    if (!user) {
        return res.status(400).send('User not found');
    }

    if (user.registerResendCount >= 5) {
      bankUser.deleteOne({email})
        return res.status(400).send('Maximum resend attempts reached. Please restart registration process.');
    }
    let emailConfirmDigits = generator.generateRandomNumber()
    user.registerResendCount++;
    user.expirationTime = Date.now() + 15 * 60 * 1000;

   registerMailSender(email, user.firstName+user.lastName,emailConfirmDigits);

    res.status(200).send('Verification code resent');
};



module.exports = {registerBankUser,verify,resendCode}
