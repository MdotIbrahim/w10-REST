const jwt = require("jsonwebtoken")
const User = require("./model");

exports.createUser = async (req, res) => { //controllers must have request object and response object
    try {
        const userObj = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        const newUser = await User.create(userObj);
        // console.log(req.body.message);
        // res.send({message: "End of Controller"}); //controller must send a response
        
        const token = await jwt.sign({id: newUser._id}, process.env.SECRET); //parameters: what to store in token (usually object to access via dot notation), then private key (used to unhash token)
        console.log("token: " + token);
        res.send({ newUser, token });
    } catch (error) {
        console.log(error);
        // return res.send({ error: error.code });
        if (error.message.includes("E11000")){
            if (error.message.includes("username")){
                console.log("error 11000: Username already exists.");
                res.send({error: "Username already exists."});
            }else{
                console.log("error 11000: Email already exists.");
                res.send({error: "Email already exists."});
            }
        }else if (error.message.includes("required") && (error.message.includes("username"))) {
            console.log("error: Invalid Username Format.");
            res.send({error: "Invalid Username Format."});
        }else{
            return res.status(500).send({error: error.message}); //at one point all error keys were called error_message so i could mentally distinguish what i made vs what was predefined (calling the error err, would also help distinguish it).
        }
    }
}

// login without credentials but also let a user login in the first place.
exports.tokenLoginUser = async (req, res) => {
    // if(req.user._id !== "undefined"){
    // }
    token = await jwt.sign({ id: req.user._id }, process.env.SECRET); //for regular login -  regardless if logged in or not - new token issued. - takes into account if secret is changed as user would be given new token.
    console.log(`User ${req.user.username} has logged in.`)
    res.send({user: req.user, token}); // for token login
}

exports.updateUser = async (req, res) => {
    try {
        const newUserObj = {
            username: req.body.newUsername,
            email: req.body.newEmail,
            password: req.body.newPassword
        };
        const updateUserRes = await User.updateOne({username: req.body.username}, {$set: newUserObj});
        console.log(updateUserRes)
        if (updateUserRes.modifiedCount > 0){
            res.send({message: "Account information has been updated"});
        }else if (updateUserRes.matchedCount === 0){
            res.send({error: "Username does not exist."});
        }else {
            res.send({error: "Account information did not update"});
        }
        // res.status({message: "Account information has been updated"}).send(updateUserRes);
    } catch (error) {
        // same code from create user error as they apply here.
        if (error.message.includes("E11000")){
            if (error.message.includes("username")){
                console.log("error 11000: Username already exists.");
                res.send({error: "Username already exists."});
            }else{
                console.log("error 11000: Email already exists.");
                res.send({error: "Email already exists."});
            }
        }else if (error.message.includes("required") && (error.message.includes("username"))) {
            console.log("error: Invalid Username Format.");
            res.send({error: "Invalid Username Format."});
        }else{
            return res.status(500).send({error: error.message}); 
        }
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deletedUserRes= await User.deleteOne({username: req.body.username});
        console.log(deletedUserRes);
        if (deletedUserRes.deletedCount > 0){
            console.log(`Account has been deleted. Goodbye ${req.body.username}.`)
            res.send({message: `Account has been deleted. Goodbye ${req.body.username}.`});
            
        }else {
            console.log("FAILURE")
            res.send({error: "Delete request failed: Username does not exist or wrong information provided."});
        }
    } catch (error) {
        // res.send( {deletedUserRES} );
        return res.status(500).send({error: error.message});
    }
}