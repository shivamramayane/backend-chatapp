import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Userdata"
    },
    members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Userdata', 
        },
      ],
      status: {
        type: String,
        enum: ['open', 'blocked'],
        default: 'open',
      },

});

export default mongoose.model('Room', userSchema);