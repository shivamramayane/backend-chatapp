import mongoose from "mongoose";

const { Schema } = mongoose;

const MessageSchema = new Schema({
  type: {
    type: String,
    enum: ["text", "image"],
    required: true,
  },
  photos: {
    type: [String],
    validate: {
      validator: function (v) {
        return this.type === "image" ? v && v.length > 0 : true;
      },
      message: "Photos are required for type 'image'",
    },
  },
  text: {
    type: String,
    validate: {
      validator: function (v) {
        return this.type === "text" ? typeof v === "string" && v.trim().length > 0 : true;
      },
      message: "Text is required for type 'text'",
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userdata",
  },
});

export default mongoose.model("Message", MessageSchema);
