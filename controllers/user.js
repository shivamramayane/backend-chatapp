 import User from "../models/User.js"
 export const getUserInfo= async(req,res)=>{
  const {userId}=req
  try{
    const data = await User.findById(userId).select('name email age about nationality occupation phone image');
    return res.status(200).json(data)
  }catch(err){
return res.json(err)
  }
 }
 import jwt from 'jsonwebtoken';

 export const getallusers = async (req, res) => {
   try {
     const token = req.headers.authorization;
     const userData = await User.find();
 
     // Verify the token and extract user ID
     let userIdFromToken = null;
     if (token) {
       jwt.verify(token, 'shivam', (err, decoded) => {
         if (!err) {
           userIdFromToken = decoded.userId;
           console.log(userIdFromToken)
         }
       });
     }
 
     // Filter out user details with matching token user ID
     const filteredUserData = userData.filter(user => user._id.toString() !== userIdFromToken);
 console.log(filteredUserData)
     res.status(200).json(filteredUserData);
   } catch (error) {
     console.error('Error fetching user data:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 };
 

// export const getallusers =async (req,res)=>{
//   try {
//     const userData = await User.find(); 
//     res.status(200).json(userData);
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
export const updateUser = async (req, res) => {
  const {userId}=req
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        occupation: req.body.occupation,
        nationality: req.body.nationality,
        location: req.body.location,
        phone: req.body.phone,
        image: req.body.image,
      },
      {
        new: true,
      }
    ).select('name email age occupation nationality location phone image');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};



