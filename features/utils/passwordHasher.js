const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = process.env.SALT_ROUNDS ;


const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const comparePassword = async (plainPassword, hash) => {
    try {
        const match = await bcrypt.compare(plainPassword, hash);
        return match;
    } catch (error) {
        throw new Error('Error comparing password');
    }
};

// Usage example
const isMatch = await comparePassword('yourPlainTextPassword', storedHash);
if (isMatch) {
    console.log('Password matches!');
} else {
    console.log('Invalid password');
}




module.exports = {hashPassword,comparePassword}

// Usage example
hashPassword('yourPlainTextPassword').then((hash) => {
    console.log(hash); // Store this hash in your database
});
