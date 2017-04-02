import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "express-jwt";

import userRouter from "./routes/user";
import roomRouter from "./routes/room";
import messageRouter from "./routes/message";

import config from "./config";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(jwt({
    secret: config.secret,
    credentialsRequired: false
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.json({ status: "error", message: "invalid token" });
    }
});

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
    res.json({ message: "Hello, World!" });
});

app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}!`);
});

export default app;