const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // For form data
app.set('view engine', 'ejs'); // Use EJS for templates
app.set('views', path.join(__dirname, 'views')); // Folder for EJS files

// Connect to MongoDB (using Atlas URI from .env)
mongoose.connect(process.env.MONGO_URI, {
  // Removed deprecated options (useNewUrlParser and useUnifiedTopology)
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Routes for pages
app.get('/', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/buses', async (req, res) => {
  const buses = await require('./models/Bus').find();
  res.render('buses', { buses });
});
app.get('/booking/:id', async (req, res) => {
  const bus = await require('./models/Bus').findById(req.params.id);
  res.render('booking', { bus });
});
app.get('/my-bookings', async (req, res) => {
  const token = req.query.token; // Pass token via query for simplicity
  if (!token) return res.redirect('/login');
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, 'secretkey');
    const bookings = await require('./models/Booking').find({ user: decoded.id }).populate('bus');
    res.render('my-bookings', { bookings });
  } catch (err) {
    res.redirect('/login');
  }
});

// API routes (for forms and AJAX)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/bookings', require('./routes/bookings'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const cookieParser = require('cookie-parser');
app.use(cookieParser());