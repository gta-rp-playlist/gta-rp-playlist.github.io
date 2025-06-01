// this filename is start_z_final_prodigy.js

document.getElementById('suggestion-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            form.reset();
            document.getElementById('response-message').style.display = 'block';
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    alert(data.errors.map(error => error.message).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }
            });
        }
    }).catch(() => {
        alert("Oops! There was a problem submitting your form");
    });
});

let lastFetchedData_2 = ''; // Store the last fetched data
let lastOpenedCategory_2 = null; // Store the last opened category

window.onload = function() {
    fetchAndUpdateSidebar_2();
    fetchAndUpdateNumbers_2(); // Fetch the numbers on page load
};

// Re-fetch the file and update the sidebar every 60 seconds (adjust as needed)
setInterval(fetchAndUpdateSidebar_2_none, 120000); // 30,000ms = .5 minute
setInterval(fetchAndUpdateNumbers_2, 120000); // 30,000ms = 30 seconds
