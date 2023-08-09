 import User from "../models/User.js"
 export const getUserInfo= async(req,res)=>{
  try{
    const data = await User.findById(req.user.id).select('name email age about nationality occupation phone');
    return res.status(200).json(data)
  }catch(err){
return res.json(err)
  }
 }


export const getallusers =async (req,res)=>{
  try {
    const users = await User.aggregate([
      {
        $lookup:{
          from:'tasks',
          localField:'_id',
          foreignField:'user',
          as:'reviews'
        }
      }
    ]);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        occupation: req.body.occupation,
        nationality: req.body.nationality,
        location: req.body.location,
        phone: req.body.phone,
      },
      {
        new: true,
      }
    ).select('name email age occupation nationality location phone');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
