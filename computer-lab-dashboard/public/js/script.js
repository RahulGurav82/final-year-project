    // Attach click event to trigger button
    document.getElementById('create-lab-btn').addEventListener('click', () => {
        Swal.fire({
          title: 'Create New Lab',
          html: `
            <form id="create-lab-form" class="space-y-4">
              <div>
                <label for="lab-name" class="block text-sm font-medium text-gray-700">Lab Name</label>
                <input type="text" id="lab-name" name="labName" required
                       class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity</label>
                <input type="number" id="capacity" name="capacity" required
                       class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              </div>
            </form>
          `,
          confirmButtonText: 'Submit',
          preConfirm: () => {
            const labName = Swal.getPopup().querySelector('#lab-name').value;
            const capacity = Swal.getPopup().querySelector('#capacity').value;
  
            // Validate inputs
            if (!labName || !capacity) {
              Swal.showValidationMessage(`Please fill out all fields`);
            }
            return { labName, capacity};
          },
        }).then((result) => {
            if (result.isConfirmed) {
              // Log the data before sending
              console.log('Data being sent:', result.value);
          
              // Send data to server
              fetch('/admin/create-lab', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(result.value),
              })
                .then((response) => response.json())
                .then((data) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Lab Created!',
                    text: `Lab "${result.value.labName}" with capacity ${result.value.capacity} created successfully.`,
                  });
                })
                .catch((error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again.',
                  });
                });
            }
          });
          
      });