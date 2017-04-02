import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
    res.send("room module");
});

export default router;