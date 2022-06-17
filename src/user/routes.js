const { Router } = require("express"); // grab specific method from express.
const userRouter = Router();
const { createUser, loginUser, updateUser, deleteUser } = require("./controller");
const {hashPassword, unhashPassword, tokenCheck, emailCheck} = require("../middleware"); //destructuring object to get function. (otherwise would need to do middleware.hashedPassword.) 
const User = require("../user/model");

userRouter.post("/user", emailCheck, hashPassword, createUser); // without brackets on function, will only run when endpoint hits instead of instantly.
userRouter.get("/user", tokenCheck, loginUser); // let user stay logged in using token
userRouter.post("/login", unhashPassword, loginUser); //login the user by unhashing the password - new token issued.

userRouter.put("/user", updateUser);
userRouter.delete("/user", deleteUser);

userRouter.get("/allusers", async (req, res) => {
    const userList = await User.find({}, {username: 1, email: 1, isVerified: 1, _id: 1});
    console.log(userList);
    res.status(200).json({allUsers: userList}); // 200 means ok
    // res.send(userList);
});


userRouter.get('/:id', async (req, res) => {
    const user = await User.findOne({where: { id: req.params.id }});
    res.status(200).json({message: user});
});

userRouter.get('/username/username', async (req, res) => {
    console.log(req.params); // has the username requested in url in this object with key being username
    // const user = await User.findOne({where: {username: req.params.username}});
    const user = await User.find({username: { $eq: req.params.username}});
    res.status(200).json({userInfo: user});
});

module.exports = userRouter;

//get and delete cannot send or receive body in react via fetch but it works in thunder client/insomnia..