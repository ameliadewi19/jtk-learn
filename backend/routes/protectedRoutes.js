const express = require('express');
const app = express();
const { authenticate } = require('./middlewares/authenticate'); // Mengimpor middleware

// Rute yang dilindungi dengan autentikasi
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
