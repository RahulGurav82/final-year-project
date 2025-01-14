const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');
const pcRoutes = require('./routes/admin');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt'); // For password hashing

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/LabMonitor', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.get("/", (req, res) => {
    res.render("login");
});


// Example route to seed an admin user (one-time setup)
app.get('/seed-admin', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('pass', 10); // Hash the password
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
    });

    await admin.save();
    res.send('Admin user created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error seeding admin');
  }
});

app.use('/admin', adminRoutes);
app.use('/pc', pcRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
