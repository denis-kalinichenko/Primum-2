import {Router} from "express";
import jwtCheck from "./../middleware/jwt";
import Message from "./../models/message";
import Room from "./../models/room";

const router = Router();

router.post("/room/:roomId", jwtCheck, (req, res, next) => {
    Room.findOne({ _id: req.params.roomId, members: {$nin: [req.user.id]} }).select("_id").exec((err, room) => {
        if (err) return res.json({status: "error", error: err.message});
        if (!room) {
            return res.json({ status: "error", error: "Permissions denied or invalid Room ID" });
        }

        const message = new Message({
            text: req.body.text,
            author: req.user.id,
            room: req.params.roomId,
        });
        message.save(err => {
            if (err) return res.json({status: "error", error: err.message});
            res.json({status: "success"});
        });
    });
});

router.get("/room/:roomId", jwtCheck, (req, res, next) => {
    Room.findOne({ _id: req.params.roomId, members: {$nin: [req.user.id]} }).select("_id").exec((err, room) => {
        if (err) return res.json({status: "error", error: err.message});
        if (!room) {
            return res.json({status: "error", error: "Permissions denied or invalid Room ID"});
        }

        Message.find({ room: room }).exec((err, message) => {
            if (err) return res.json({status: "error", error: err.message});
            res.json(message);
        });
    });
});

export default router;