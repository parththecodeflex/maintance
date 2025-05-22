// 1. Wait for the HTML document to be fully loaded and parsed.
document.addEventListener('DOMContentLoaded', function() {

    // 2. Get references to the HTML elements we'll interact with.
    const form = document.getElementById('maintenanceForm'); // The <form> element
    const formMessage = document.getElementById('form-message'); // The <div> for showing messages
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'; // << IMPORTANT: REPLACE THIS

    // 3. Add an event listener to the form for when it's submitted.
    form.addEventListener('submit', function(e) {
        // 4. Prevent the default HTML form submission (which would cause a page reload).
        e.preventDefault();

        // 5. Provide immediate feedback to the user that something is happening.
        formMessage.textContent = 'Submitting...';
        formMessage.className = ''; // Reset any previous styling (like 'success' or 'error')

        // 6. Create a FormData object from the HTML form.
        // This easily collects all the input field names and their values.
        const formData = new FormData(form);

        // 7. Convert FormData to a simple JavaScript object.
        // While fetch can sometimes send FormData directly, converting to JSON
        // is often more reliable, especially when the backend (Apps Script) expects JSON.
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // 8. Use the 'fetch' API to send the data to your Google Apps Script.
        fetch(SCRIPT_URL, {
            method: 'POST',         // We are sending data, so use POST method.
            mode: 'cors',           // 'Cross-Origin Resource Sharing' - necessary because your
                                    // website (e.g., on GitHub Pages) is on a different domain
                                    // than your Apps Script (script.google.com).
            cache: 'no-cache',      // Don't cache this request.
            headers: {
                // Tell the server (Apps Script) that the data we're sending is in JSON format.
                'Content-Type': 'application/json',
            },
            redirect: 'follow',     // Follow any redirects the server might send.
            body: JSON.stringify(data) // Convert the JavaScript 'data' object into a JSON string to send.
        })
        .then(response => response.json()) // 9. Once a response is received, parse it as JSON.
                                           // (Our Apps Script is configured to return JSON).
        .then(result => { // 10. 'result' is the parsed JSON object from Apps Script.
            console.log('Success:', result); // Log the result to the browser console for debugging.
            if (result.status === "success") {
                // If Apps Script reported success:
                formMessage.textContent = result.message || 'Request submitted successfully!';
                formMessage.className = 'success'; // Apply 'success' CSS class for styling.
                form.reset(); // Clear the form fields for a new submission.
            } else {
                // If Apps Script reported an error:
                formMessage.textContent = result.message || 'An error occurred.';
                formMessage.className = 'error'; // Apply 'error' CSS class for styling.
            }
        })
        .catch(error => { // 11. If there was a network error or other problem with the fetch itself.
            console.error('Error:', error); // Log the error to the browser console.
            formMessage.textContent = 'Submission failed. Please try again. ' + error;
            formMessage.className = 'error'; // Apply 'error' CSS class.
        });
    });
});
