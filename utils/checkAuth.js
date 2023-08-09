// import jwt from 'jsonwebtoken';

// const checkAuth = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   jwt.verify(token, 'shivam', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid token' });
//     }

//     req.user = decoded;
//     next();
//   });
// };

// export default checkAuth;
import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'shivam', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = decoded;

    // Extract user ID and attach it to req.userId
    req.userId = decoded.id; 
    console.log(req.userId)
    // Adjust the key according to your JWT payload

    next();
  });
};

export default checkAuth;

