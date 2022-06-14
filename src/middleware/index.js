const bcrypt = require("bcryptjs");

exports.hashPassword = async (req, res, next) => { // third parameter is function called next - contro
    try {
        const plainPass = req.body.password;
        console.log(`Plain Text: ${plainPass}`);
        const hashedPass = await bcrypt.hash(plainPass, 10);
        console.log(`Hashed: ${hashedPass}`);
        req.body.password = hashedPass;


        next(); //moves onto next function - otherwise after req.send(), it will hang on the function. (how express works)
    } catch (error) {
        console.log(error);
    }
};