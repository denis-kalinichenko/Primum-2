import { Router } from "express";
import jwt from "express-jwt";
import User from "./../models/user";
import config from "./../../config";

const router = Router();

router.get("/", jwt( { secret: config.secret } ), (req, res, next) => {
    User.find().select("username").exec((err, users) => {
        if (err) return res.json({ status: "error", error: err.message });
        res.json(users);
    });
});

router.post("/", (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    user.save(err => {
        if (err) return res.json({ status: "error", error: err.message });
        res.json({ message: "success" });
    });
});

router.post("/token", (req, res, next) => {
    User.authorize(req.body.username, req.body.password, (err, token) => {
        if (err) return res.json({ status: "error", error: err.message });
        res.json({ status: "success", token: token });
    })
});

export default router;