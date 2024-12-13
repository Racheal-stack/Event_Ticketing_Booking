// middlewares/basicAuth.js
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader) {
      return res.status(401).send('Authorization header is missing');
    }
  
    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');
  
    const validUsername = process.env.BASIC_AUTH_USER || 'admin';
    const validPassword = process.env.BASIC_AUTH_PASS || 'password123';
  
    if (username === validUsername && password === validPassword) {
      return next(); // Valid credentials
    }
  
    res.status(401).send('Invalid credentials');
  };
  