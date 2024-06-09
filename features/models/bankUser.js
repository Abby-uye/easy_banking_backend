const mongoose = require(`mongoose`);
const {Schema} = mongoose
const addressSchema = require('./userAddress');

//user will later have a correct nin and bvn

const validateEmail = (email)=>  {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
};

const validatePassword = (password) =>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const BankUserSchema = new Schema({
    fullName:{
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
        require:true,
        validate:[validatePassword,"Not a valid password! Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character`"]

    },

    address: {
        type: addressSchema,
        required: true
    }
})

const BankUser = mongoose.model('bank_user', BankUserSchema);

module.exports = BankUser
