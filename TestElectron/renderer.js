document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const labId = document.getElementById('labId').value;
    const pcName = document.getElementById('PCName').value;

    try {
        const response = await fetch('http://localhost:4000/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ labId, pcName }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save lab details to localStorage
            localStorage.setItem('labName', data.lab.labName);
            localStorage.setItem('labId', data.lab.labId);
            localStorage.setItem('pcName', data.pc.pcName);

            // Redirect to the labDetails.html page
            window.location.href = 'labDetails.html';
        } else {
            document.getElementById('message').innerText = data.message;
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Error connecting to server.';
    }
});
