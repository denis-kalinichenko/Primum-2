import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "express-jwt";
import socketIO from "socket.io";

import userRouter from "./routes/user";
import roomRouter from "./routes/room";
import messageRouter from "./routes/message";

import config from "./config";

const app = express();

app.use(cors({optionsSuccessStatus: 200}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(jwt({
    secret: config.secret,
    credentialsRequired: false
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/message", messageRouter);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.json({status: "error", message: "Invalid token"});
    }
    res.json({status: "error", message: err.message});
});

app.get("/", (req, res) => {
    res.json({message: "Hello, World!"});
});

const server = app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}!`);
});

const io = socketIO.listen(server);

io.on("connection", socket => {
    socket.on("roomOpen", id => {
        console.log("Room open: ", id);
    });
});

export default app;