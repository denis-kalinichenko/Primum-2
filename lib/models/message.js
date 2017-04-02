import mongoose from "./../mongoose";

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        stripHtmlTags: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    sent: {
        type: Date,
        default: Date.now,
    }
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;