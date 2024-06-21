const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error.message);
        throw new Error('Error hashing password');
    }
};

const comparePassword = async (plainPassword, hash) => {
    try {
        const match = await bcrypt.compare(plainPassword, hash);
        return match;
    } catch (error) {
        console.error('Error comparing password:', error.message);  // Log the actual error
        throw new Error('Error comparing password');
    }
};

module.exports = { hashPassword, comparePassword };


// Usage example
// Replace 'yourPlainTextPassword' and 'storedHash' with actual values
// const isMatch = await comparePassword('yourPlainTextPassword', storedHash);
// if (isMatch) {
//     console.log('Password matches!');
// } else {
//     console.log('Invalid password');
// }

module.exports = { hashPassword, comparePassword };
