const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../user/model");

exports.hashPassword = async (req, res, next) => { // third parameter is function called next
    try {
        if (res.locals.skipHashFunc) return next()

        if (req.body.newPassword) var plainPass = req.body.newPassword; //var to use variable outside function.
        else if (req.body.password) var plainPass = req.body.password;

        console.log(`Plain Text Unsaved: ${plainPass}`);
        try {
            if (plainPass.length >= 7){
                const hashedPass = await bcrypt.hash(plainPass, 10);
                console.log(`Hashed Unsaved: ${hashedPass}`);

                if (req.body.newPassword) req.body.newPassword = hashedPass;
                else if (req.body.password) req.body.password = hashedPass;
                
                next(); //moves onto next function - otherwise after req.send(), it will hang on the function. (how express works)
            }else {
                console.log("Password length must be at least 7 characters.");
                res.send({ error: "Password length must be at least 7 characters." });
            }
        } catch (error) {
            console.log(error);
            console.log("Password was probably undefined.");
            next();
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
            console.log("unhash successful")
            next();
        }else {
            res.send({error: "Something went Wrong"});
            // throw new Error("Incorrect username or password.");
        }
    } catch (error) {
        console.log(error);
        res.send({error: "Incorrect username or password."})
        // res.send({error: error.code});
    }
};

exports.tokenCheck = async (req, res, next) => {
    try {
        const token = req.header("Authorization"); //takes current token from header
        console.log("Authorization header's token value: ", token);
        const decodedToken = jwt.verify(token, process.env.SECRET); //decode the token - parameters are the token and the secret it was hashed with.
        console.log("decoded token:" + decodedToken);
        req.user = await User.findById(decodedToken.id); // make new key in req object with value being the user found from db..now just need controller that sends the req.user back.
        next(); // must have this otherwise it will stay here and not move onto login controller.
    }catch (error) {
        // console.log(error);
        // if (error.includes(""))
        // // if (token === "undefined")
        console.log("Token doesn't exist as user is not logged in.");
        res.send({error: error.code});
    }
}

//new use is for update email info check
exports.emailCheck = (req, res, next) => {
    try {
        if (req.body.newEmail){
            if (req.body.newEmail.includes("@") && (req.body.newEmail.includes("."))){
                next();
            }
            else {
                console.log("Invalid Email Format");
                res.send({error: "Invalid Email Format"});;
            }
        }else{
            next();
        }
        // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
        //     next();
        // }
    } catch (err) {
        console.log(err);
        // res.send({error: "Invalid Email Format"});;
        }  
    }

exports.userInputCheck = (req, res, next) => {
    try {
        if (req.body.username.length > 0 && (req.body.password.length > 0) && (req.body.email.length > 0)){
            if (req.body.email.includes("@") && (req.body.email.includes("."))){
                next();
            }else{
                console.log("Invalid Email Format");
                // res.send({error_message: "Invalid Email Format"});
                res.send({error: "Invalid Email Format"});;
            }
        }else{
            console.log("Please fill in all fields.");
            res.send({error: "Please fill in all fields."});;
        }
    } catch (err) {
        // console.log(err);
        console.log("Please fill in all fields.");
        res.send({error: "Please fill in all fields."});;
        }  
    }

//TODO - 
exports.updateInputCheck = (req, res, next) => {
    try {
        if (req.body.newUsername === "") req.body.newUsername = void 0;
        if (req.body.newEmail === "") req.body.newEmail = void 0;
        if (req.body.newPassword === "" || req.body.newPassword === "undefined") {
            req.body.newPassword = void 0;
            res.locals.skipHashFunc = true;
        }
        next();
    } catch (err) {
        console.log(err);
        res.send({error: err});;
        }  
    }

//? if you see illegal arguement error but it looks right, consider if you needed async await.
//?Cannot set headers after they are sent to the client - this error means youre trying to send 2 different responses in one function.