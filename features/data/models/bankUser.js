const mongoose = require(`mongoose`);
const {Schema} = mongoose
const addressSchema = require('./userAddress');

const {userStatus} = require("../../constants/userconstants");
//user will later have a correct nin and bvn

const validateEmail = (email)=>  {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
};


const BankUserSchema = new Schema({
    firstName:{
        type:String,
        require:true

    },
    lastName:{
        type:String,
        require:true

    },
    email:{
        type:String,
        unique:true,
        require:true,
        lowercase: true,
        validate:[validateEmail,'Please fill a valid email address']

    },
    password:{
        type:String,
        require:true

    },

    address: {
        type: addressSchema,
    },
    emailConfirmDigits:{
        type:Number
    },
    registerResendCount:{
        type:Number
    },
    status: {
        type: String,
        enum: Object.values(userStatus),
        default: userStatus.NOT_AUTHENTICATED
    },
    expirationTime:{
        type:Date
    }
})

const BankUser = mongoose.model('bank_user', BankUserSchema);

module.exports = BankUser
