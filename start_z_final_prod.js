// this filename is start_z_final.js

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

let lastFetchedData_2 = '';
let lastOpenedCategory_2 = null;

window.onload = function() {
    fetchAndUpdateSidebar_2();
    fetchAndUpdateNumbers_2();
};

setInterval(fetchAndUpdateSidebar_2_none, 60000);
setInterval(fetchAndUpdateNumbers_2, 60000);