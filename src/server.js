require("./db/connection"); // runs entire file on line 1 this way
const express = require("express");
const cors = require("cors"); // new way to allow apps to send requests! full stack - insomnia works differently as it injects requests...
const app = express();
const PORT = process.env.PORT || 5001; // this is future proofing -- not needed right now.
const userRouter = require("./user/routes");

app.use(express.json()); // telling express all requests recieved will be treated like JSON
app.use(cors()); // full stack - must be placed here
app.use(userRouter);

app.set("port", PORT);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

