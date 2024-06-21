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
        const hashedPassword = await hashPassword(password)
        if (user) {
            throw new UserExistException("this email is already in use")
        }
    console.log('Received password:', password);

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

const registerMailSender = (email,fullName,emailConfirmDigits)=>{
   let subject= 'Welcome to the Easy Banking!'
     let  text= `Hello ${fullName},\n\nWelcome to the Easy Banking! We are glad to have you on board.\n\nPlease enter this 6 digits to confirm your email ${emailConfirmDigits}\n\nBest Regards,\nEasy Banking team`

    sendWelcomeEmail(email, fullName,emailConfirmDigits, subject, text)
}


const verify = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        console.log("Starting verifiuser")
        const user = await bankUser.findOne({ email });
        console.log(user.email)


        if (!user) {
            return res.status(400).send('User not found');
        }

        if (Date.now() > user.expirationTime) {
            return res.status(400).send('Verification code has expired');
        }

        if (user.emailConfirmDigits === verificationCode) {
            user.status = userStatus.AUTHENTICATED;

            // Save the updated user document
            await user.save();

            return res.status(200).send('Registration complete');
        } else {
            return res.status(400).send('Invalid verification code');  // Changed to 400 for a client error
        }
    } catch (error) {
        console.error('Error verifying user:', error.message);
        return res.status(500).send('Internal server error');
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
