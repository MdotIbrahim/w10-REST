const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../user/model");

exports.hashPassword = async (req, res, next) => { // third parameter is function called next
    try {
        const plainPass = req.body.password;
        console.log(`Plain Text Unsaved: ${plainPass}`);
        if (plainPass.length >= 7){
            const hashedPass = await bcrypt.hash(plainPass, 10);
            console.log(`Hashed Unsaved: ${hashedPass}`);
            req.body.password = hashedPass;
            next(); //moves onto next function - otherwise after req.send(), it will hang on the function. (how express works)
        }else {
            console.log("Password length too short.");
            res.send({ error: "Password length too short." });
        }

    }  catch (error) {
        console.log(error);
        res.send({ error: error.code });
    }
};

exports.unhashPassword = async (req, res, next) => {
    try {
        req.user = await User.findOne({username: req.body.username}); // by storing in req.user you can now use the same controller used for token login (which is persistent) to let user login in the first place.
        const result = await bcrypt.compare(req.body.password, req.user.password);
        if (result) {
            next();
        }else {
            throw new Error("Incorrect username or password.")
        }
    } catch (error) {
        console.log(error);
        res.send({error: error.code});
    }
};

exports.tokenCheck = async (req, res, next) => {
    try {
        const token = req.header("Authorization"); //takes current token from header
        console.log("Authorization header's token value: ", token);
        const decodedToken = jwt.verify(token, process.env.SECRET); //decode the token - parameters are the token and the secret it was hashed with.
        console.log(decodedToken);
        req.user = await User.findById(decodedToken.id); // make new key in req object with value being the user found from db..now just need controller that sends the req.user back.
        next(); // must have this otherwise it will stay here and not move onto login controller.
    }catch (error) {
        console.log(error);
        res.send({error: error.code});
    }
}

exports.emailCheck = (req, res, next) => {
    if (req.body.email.includes("@") && (req.body.email.includes("."))){
        next();
    }
    // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
    //     next();
    // }
    else{
        console.log("Invalid Email Format");
        res.send({error_message: "Invalid Email Format"});
    }     
}