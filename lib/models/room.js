import mongoose from "./../mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
        trim: true,
        stripHtmlTags: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    created: {
        type: Date,
        default: Date.now,
    }
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;