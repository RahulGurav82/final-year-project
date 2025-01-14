const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Lab = require('../models/Lab'); // Path to the Lab model
const PC = require('../models/PC');
const bcrypt = require('bcrypt'); // For password hashing

const logs = [
  { date: '2025-01-10', action: 'Added Student: John Doe' },
  { date: '2025-01-11', action: 'Created Lab: Lab A' },
];


// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin in the database
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).send('Invalid credentials');
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      res.redirect('/admin/dashboard');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// Render dashboard
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));

// Render Add Student
router.get('/add-student', (req, res) => res.render('admin/add-student'));
// Handle Add Student Form Submission
// Utility to generate a random password
function generatePassword(name) {
  const specialChars = "1234567890";
  const randomSpecialChars = Array(4)
    .fill(null)
    .map(() => specialChars[Math.floor(Math.random() * specialChars.length)])
    .join("");
  return `${name.split(' ').join('')}${randomSpecialChars}`;
}

router.post('/add-student', async (req, res) => {
  const { name, roll, department, class: studentClass, whatsapp } = req.body;

  try {
    // Generate password
    const plainPassword = generatePassword(name);

    // Hash the password before saving
    // const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create a new student document
    const newStudent = new Student({
      name,
      roll,
      password: plainPassword,
      department,
      class: studentClass,
      whatsapp,
    });

    // Save the student to the database
    await newStudent.save();

    console.log(`Student added. Generated password: ${plainPassword}`); // Optional: Log the generated password
    res.redirect('/admin/dashboard'); // Redirect to the dashboard after adding
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding student');
  }
});

// Route to show all labs
router.get('/show-labs', async (req, res) => {
  try {
    // Fetch all labs from the database
    const labs = await Lab.find();
    res.render('admin/show-labs', { labs }); // Render the labs in show-labs.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching labs');
  }
});

// Route to display students
router.get('/view-students', async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find();
    res.render('admin/view-students', { students });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching students');
  }
});

// Render Create Lab
router.get('/create-lab', (req, res) => res.render('admin/create-lab'));

// Route to create lab
router.post('/create-lab', async (req, res) => {
  const { labName, capacity } = req.body;

  // Generate a 5-digit lab ID
  let labId;
  do {
    labId = Math.floor(10000 + Math.random() * 90000).toString(); // Generates a random 5-digit number
  } while (await Lab.findOne({ labId })); // Ensure it's unique

  try {
    const newLab = new Lab({
      labName,
      capacity,
      labId,
    });

    // Save the new lab to the database
    await newLab.save();
    res.redirect('/admin/dashboard'); // Redirect to the dashboard after creating the lab
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating lab');
  }
});


// Render View Logs
router.get('/view-logs', (req, res) => res.render('admin/view-logs', { logs }));
// Route to view a specific lab

router.get('/lab/:labId', async (req, res) => {
  const { labId } = req.params;
  try {
    const lab = await Lab.findOne({ labId });
    if (!lab) {
      return res.status(404).send('Lab not found');
    }

    const pcs = await PC.find({ labId }); // Fetch PCs associated with the lab
    res.render('admin/view-lab', { lab, pcs }); // Pass PCs to the view
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching lab details');
  }
});

// Handle Add Student
router.post('/add-student', (req, res) => {
  const { name } = req.body;
  logs.push({ date: new Date().toISOString().split('T')[0], action: `Added Student: ${name}` });
  res.redirect('/admin/view-logs');
});

// Handle Create Lab
router.post('/create-lab', (req, res) => {
  const { labName } = req.body;
  logs.push({ date: new Date().toISOString().split('T')[0], action: `Created Lab: ${labName}` });
  res.redirect('/admin/view-logs');
});

module.exports = router;