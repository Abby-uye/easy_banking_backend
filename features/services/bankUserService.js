bankUser =  require("../models/bankUser")
const UserExistException = require("../exception/userExistException");
const UserException = require("../exception/userException");
const {sendWelcomeEmail} = require("../utils/nodeMailer");

const registerBankUser = async(registrationRequest)=>{

        const {fullName, email, password, address} = registrationRequest;
        const user = await bankUser.findOne({email});

        if (user) {
            throw new UserExistException("this email is already in use")
        }

        const newBankUser = {
            fullName,
            email,
            password,
            address

        }
        const savedUser = await bankUser.create(newBankUser)
        const response = {
            id: savedUser._id,
            firstName: savedUser.fullName,
            email: savedUser.email,
            address: savedUser.address
        }

        registerMailSender(email,fullName)
        return {
            data: response,
            message: "Registration successful"

        }


}

const registerMailSender = (email,fullName)=>{
   let subject= 'Welcome to the Easy Banking!'
     let  text= `Hello ${fullName},\n\nWelcome to the Easy Banking! We are glad to have you on board.\n\nBest Regards,\nEasy Banking team`
    sendWelcomeEmail(email, fullName, subject, text)
}

module.exports = {registerBankUser}

