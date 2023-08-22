// import bcryptjs from "bcryptjs";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";


// export const register = async (req, res) => {
//   try {
//     const salt = await bcryptjs.genSalt(10);
//     const hashpassword = await bcryptjs.hash(req.body.password, salt);
//     const newuser = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashpassword,
//     });
//     await newuser.save();

//     // Create a JWT token
//     // const token = jwt.sign({ userId: newuser._id }, 'shivam', {
//     //   expiresIn: '1h', // Set the token expiration time as needed
//     // });
//     const payload = {
//       id: newuser._id,
//       name: newuser.name,
//     };

//     const token = jwt.sign(payload, 'shivam', {
//       expiresIn: '1d',
//     });
//     // Create the combined response object
//     const combinedResponse = {
//       ...newuser.toObject(),
//       token: token,
//     };

//     // Return the combined response object
//     return res.status(201).json(combinedResponse);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };



// export const login = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email }).select(
//       'name email password'
//     );
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     const isPasswordCorrect = await bcryptjs.compare(
//       req.body.password,
//       user.password
//     );

//     if (!isPasswordCorrect) {
//       return res.status(401).json({ error: 'Incorrect password' });
//     }

//     const payload = {
//       id: user._id,
//       name: user.name,
//     };

//     const token = jwt.sign(payload, 'shivam', {
//       expiresIn: '1d',
//     });

//     return res.status(200).json({ message: 'Login success', user: user, token: token });
   
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };


// export const logout = (req, res) => {
//   res.clearCookie("access_token");
//   return res.status(200).json({ message: "logout success" });
// };

// export const isloggedIn = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return res.json(false);
//   }
//   return jwt.verify(token, "shivam", (err) => {
//     if (err) {
//       return res.json(false);
//     } else {
//       return res.json(true);
//     }
//   });
// };
import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(req.body.password, salt);
    const newuser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashpassword,
    });
    await newuser.save();

    // Create a new token for the registration session
    const token = jwt.sign({ userId: newuser._id }, 'shivam', {
      expiresIn: '1h', // Set the token expiration time as needed
    });
    const user = {
            ...newuser.toObject(),
            token: token,
          };
    return res.status(201).json({ message: 'User registered successfully', user:user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Create a new token for the login session
    const token = jwt.sign({ userId: user._id }, 'shivam', {
      expiresIn: '1d',
    });

    return res.status(200).json({ message: 'Login success', user: user, token:token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
