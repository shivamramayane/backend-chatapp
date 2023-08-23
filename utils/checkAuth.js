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
console.log('TOKEN', token)
console.log('req.headers', req.headers)
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'shivam', (err, decoded) => {

    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
console.log("decoded",decoded)
    req.user = decoded;

    // Extract user ID and attach it to req.userId
    req.userId = decoded.userId; 
    console.log(req.userId)
    // Adjust the key according to your JWT payload

    next();
  });
};

export default checkAuth;