import randomstring from "randomstring";
import md5 from "md5";
import sha1 from "sha1";
import jwt from "jsonwebtoken";
import mongoose from "./../mongoose";
import config from "./../../config";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        stripHtmlTags: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

UserSchema.methods.encryptPassword = function (password) {
    return md5(sha1(this.salt) + sha1(password));
};

UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

const passwordField = UserSchema.virtual('password');
passwordField.set(function (password) {
    this._plainPassword = password;
    this.salt = randomstring.generate();
    this.hashedPassword = this.encryptPassword(password);
});
passwordField.get(function () {
    return this._plainPassword;
});

UserSchema.statics.authorize = function (username, password, callback) {
    const User = this;
    User.findOne({ username: username }).exec((err, user) => {
        if (err) return callback(err);
        if (!user) return callback(new Error("User not found."));
        if (!user.checkPassword(password)) return callback(new Error("Invalid password or username."));
        callback(null, jwt.sign({
            username: user.username,
            iat: Math.floor(Date.now() / 1000) - 30
        }, config.secret))
    });
};

const User = mongoose.model('User', UserSchema);

export default User;