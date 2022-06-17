require("./db/connection"); // runs entire file on line 1 this way
const express = require("express");
const app = express();
const port = process.env.PORT || 5001; // this is future proofing -- not needed right now.
const userRouter = require("./user/routes");


// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
// app.use(bodyParser.json());

app.use(express.json()); // telling express all requests recieved will be treated like JSON
app.use(userRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

