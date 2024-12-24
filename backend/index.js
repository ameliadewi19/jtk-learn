const express = require('express');
const cors = require('cors'); // Import cors
const { authenticate } = require('./middleware/authenticate');
const { authorizeRole } = require('./middleware/authorizeRole');
const authRouter = require('./routes/authRoutes'); // Import the auth routes
const courseRouter = require('./routes/courseRoutes'); // Import the course routes
const userRouter = require('./routes/userRoutes'); // Import the user routes
const bodyParser = require('body-parser');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routers
app.use('/auth', authRouter);
app.use('/users', authenticate, userRouter);
app.use('/courses', authenticate, authorizeRole(['pengajar','pelajar']), courseRouter);

// To check authentication
app.get('/protected-route', authenticate, (req, res) => {
    res.send('You have access to this route');
});

/*
    Dibawah merupakan contoh penggunaan middleware
    authenticate digunakan untuk memastikan user login
    authorizeRole digunakan untuk memastikan route diakses oleh role yang sesuai

    // Protected route example
    app.get('/protected-route', authenticate, (req, res) => {
    res.send('You have access to this route');
    });
    // Route khusus pelajar
    app.get('/pelajar', authenticate, authorizeRole(['pelajar']), (req, res) => {
        res.json({ message: 'Welcome, pelajar!' });
    });
    // Route khusus pengajar
    app.get('/pengajar', authenticate, authorizeRole(['pengajar']), (req, res) => {
        res.json({ message: 'Welcome, pengajar!' });
    });

*/

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
