// const User = require("./model");

const User = require("./model");

exports.createUser = async (req, res) => { //controllers must have request object and response object
    try {
        const userObj = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password};
        const newUser = await User.create(userObj);
        res.send( {newUser} );
        // console.log(req.body.message);
        // res.send({message: "End of Controller"}); //controller must send a response
    } catch (error) {
        console.log(error);
        res.send({error: error.code});
    } finally {

    }
}