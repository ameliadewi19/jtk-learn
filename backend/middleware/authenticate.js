const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Mengambil token dari header Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verifikasi token menggunakan secret key dari environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Menyimpan payload token ke dalam req.user
    next(); // Melanjutkan ke rute berikutnya
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };
