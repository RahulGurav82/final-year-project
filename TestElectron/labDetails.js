async function deleteRequirement(labId, pcName, description, index) {
    console.log('deleteRequirement triggered', { labId, pcName, description, index }); // Debugging line
    try {
        const response = await fetch('http://localhost:4000/requirements', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ labId, pcName, description }),
        });
    
        if (response.ok) {
            console.log('Delete response:', await response.json()); // Debugging line
            requirements.splice(index, 1); // Remove from local array
            updateRequirementsTable(requirements); // Update UI
        } else {
            console.error('Failed to delete requirement:', await response.json());
            alert('Failed to delete requirement.');
        }
    } catch (error) {
        console.error('Error deleting requirement:', error);
        alert('success');
    }
}


window.onload = () => {
    // Retrieve lab details from localStorage
    const labName = localStorage.getItem('labName');
    const labId = localStorage.getItem('labId');
    const pcName = localStorage.getItem('pcName');

    // Display the details on the page
    document.getElementById('labName').innerText = `Lab Name: ${labName}`;
    document.getElementById('labId').innerText = `Lab ID: ${labId}`;
    document.getElementById('pcName').innerText = `PC Name: ${pcName}`;

    const requirements = [];

    // Continuously fetch requirements every 5 seconds
    setInterval(fetchAndRenderRequirements, 2000);

    // Handle requirement form submission
    document.getElementById('requirementForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        const newRequirement = { description, date, status: 'Pending' };

        try {
            const response = await fetch('http://localhost:4000/requirements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ labId, pcName, description, date }),
            });

            if (response.ok) {
                const result = await response.json();

                requirements.push({
                    ...newRequirement,
                    id: result.id,
                    labId,  // Include labId
                    pcName, // Include pcName
                });

                updateRequirementsTable(requirements);
                document.getElementById('requirementForm').reset();
            } else {
                alert('Failed to add requirement to the server.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to the server.');
        }
    });

    async function fetchAndRenderRequirements() {
        try {
            const response = await fetch('http://localhost:4000/requirements');
            if (response.ok) {
                const allRequirements = await response.json();

                // Filter requirements matching the current lab and PC
                const filteredRequirements = allRequirements.filter(req => 
                    req.labId === labId && req.pcName === pcName
                );

                updateRequirementsTable(filteredRequirements);
            } else {
                console.error('Failed to fetch requirements.');
            }
        } catch (error) {
            console.error('Error fetching requirements:', error);
        }
    }

    function updateRequirementsTable(requirements) {
        const tableBody = document.querySelector('#requirementsTable tbody');
        tableBody.innerHTML = '';

        requirements.forEach((req, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${req.description}</td>
                <td>${req.date}</td>
                <td>${req.status}</td>
                <td>
                    <button onclick="deleteRequirement('${req.labId}', '${req.pcName}', '${req.description}', ${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    async function deleteRequirement(labId, pcName, description, index) {
        console.log('deleteRequirement triggered', { labId, pcName, description, index }); // Debugging line
        try {
            const response = await fetch('http://localhost:4000/requirements', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ labId, pcName, description }),
            });
        
            if (response.ok) {
                console.log('Delete response:', await response.json()); // Debugging line
                requirements.splice(index, 1); // Remove from local array
                updateRequirementsTable(requirements); // Update UI
            } else {
                console.error('Failed to delete requirement:', await response.json());
                alert('Failed to delete requirement.');
            }
        } catch (error) {
            console.error('Error deleting requirement:', error);
            alert('Error connecting to the server.');
        }
    }
    
    
};
