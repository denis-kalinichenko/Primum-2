import mongoose from "mongoose";
import config from "./../../config";

export default mongoose.connect(config.mongodb.uri, config.mongodb.options, err => {
    if (err) {
        console.log('connection error', err);
    }
});

export const db = mongoose.connection;