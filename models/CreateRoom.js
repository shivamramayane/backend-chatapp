import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userdata",
  },
  latestmessage: {
   type:String,
   default:""
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdata",
    },
  ],
  status: {
    type: String,
    enum: ["open", "blocked"],
    default: "open",
  },
  date:{
    type:String,
    default:""
  }
});

export default mongoose.model("Room", userSchema);
