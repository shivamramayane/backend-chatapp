import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age:{
    type:String,
    default:""
  },
  occupation:{
    type:String,
    default:""
  },
  nationality:{
    type:String,
    default:""
  },
  about:{
    type:String,
    default:""
  },
  phone:{
    type:String,
    default:""
  }
});

export default mongoose.model('Userdata', userSchema);