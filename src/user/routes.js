const { Router } = require("express"); // grab specific method from express.
const userRouter = Router();
const { createUser } = require("./controller");
const {hashPassword} = require("../middleware"); 

userRouter.post("/user", hashPassword, createUser); // without brackets on function, will only run when endpoint hits instead of instantly.

module.exports = userRouter;
