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
  },
  ineterest:{
    type:[String],
  
  },
  image:{
    type:String,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
});

export default mongoose.model('Userdata', userSchema);