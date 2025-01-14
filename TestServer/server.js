const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Lab = require('./Lab.js'); // Import the Lab model
const PC = require('./PC.js'); // Import the PC model
const Requirement = require('./Requirement.js'); // Import the PC model

const app = express();
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/LabMonitor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Endpoint for lab authentication
app.post('/authenticate', async (req, res) => {
    const { labId, pcName } = req.body;

    try {
        // Check if the lab exists with the matching labId
        const lab = await Lab.findOne({ labId });

        if (lab) {
            // Save the PC details
            const pc = new PC({ pcName, labId });
            await pc.save();

            return res.json({
                success: true,
                message: 'Authentication successful',
                lab,
                pc,
            });
        }

        res.status(401).json({ success: false, message: 'Invalid labId' });
    } catch (err) {
        console.error('Error during authentication:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Add a requirement
app.post('/requirements', async (req, res) => {
    const { labId, pcName, description, date } = req.body;

    try {
        const newRequirement = new Requirement({ labId, pcName, description, date });
        await newRequirement.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving requirement.' });
    }
});

// Fetch requirements (updated to include PC Name in response if needed)
app.get('/requirements', async (req, res) => {
    try {
        const requirements = await Requirement.find();
        res.json(requirements);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching requirements.' });
    }
});

app.delete('/requirements', async (req, res) => {
    const { labId, pcName, description } = req.body;

    console.log('Delete request received with:', req.body); // Debugging line

    try {
        const deletedRequirement = await Requirement.findOneAndDelete({
            labId,
            pcName,
            description,
        });

        if (deletedRequirement) {
            console.log('Requirement deleted:', deletedRequirement); // Debugging line
            return res.status(200).json({ success: true, message: 'Requirement deleted successfully.' });
        } else {
            console.log('Requirement not found.');
            return res.status(404).json({ success: false, message: 'Requirement not found.' });
        }
    } catch (error) {
        console.error('Error deleting requirement:', error);
        return res.status(500).json({ success: false, message: 'Error deleting requirement.' });
    }
});




// Start the server
app.listen(4000, () => console.log('Server is running on http://localhost:4000'));
