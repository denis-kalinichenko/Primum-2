import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "express-jwt";

import userRouter from "./routes/user";
import roomRouter from "./routes/room";
import messageRouter from "./routes/message";

import config from "./config";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(jwt({
    secret: config.secret,
    credentialsRequired: false
}));

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/message", messageRouter);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.json({ status: "error", message: "Invalid token" });
    }
    res.json({ status: "error", message: err.message });
});

app.get("/", (req, res) => {
    res.json({ message: "Hello, World!" });
});

app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}!`);
});

export default app;