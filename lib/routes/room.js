import {Router} from "express";
import jwtCheck from "./../middleware/jwt";
import Room from "./../models/room";

const router = Router();

router.get("/", jwtCheck, (req, res, next) => {
    Room.find({members: {$elemMatch: {$gte: req.user.id}}}).select("_id, name").exec((err, rooms) => {
        if (err) return res.json({status: "error", error: err.message});
        res.json(rooms);
    });
});

router.post("/", jwtCheck, (req, res, next) => {
    const room = new Room({
        creator: req.user.id,
    });
    room.members.push(req.user.id);
    room.save(err => {
        if (err) return res.json({status: "error", error: err.message});
        res.json({status: "success", room: room,});
    });
});

router.get("/:id", jwtCheck, (req, res, next) => {
    Room.findOne({_id: req.params.id, members: {$in: [req.user.id]}}).exec((err, room) => {
        if (err) return res.json({status: "error", error: err.message});
        if (!room) {
            return res.json({status: "error", error: "Permissions denied or invalid Room ID"});
        }
        res.json(room);
    });
});

router.put("/:id", jwtCheck, (req, res, next) => {
    Room.findOneAndUpdate({ _id: req.params.id, members: {$in: [req.user.id]} },
        {name: req.body.name},
        {safe: true, upsert: true, new: true}
    ).exec((err, room) => {
        if (err) return res.json({status: "error", error: err.message});
        if (!room) {
            return res.json({status: "error", error: "Permissions denied or invalid Room ID"});
        }
        res.json({status: "success", room: room});
    });
});

router.post("/:id/join", jwtCheck, (req, res, next) => {
    const userId = req.body.id || req.user.id;
    Room.findOneAndUpdate({_id: req.params.id, members: {$nin: [userId]}},
        {$push: {"members": userId}},
        {safe: true, upsert: true, new: true},
    ).exec((err, room) => {
        if (err) return res.json({status: "error", error: err.message});
        if (!room) {
            return res.json({status: "error", error: "Permissions denied or invalid Room ID"});
        }
        res.json({status: "success"});
    });
});

export default router;