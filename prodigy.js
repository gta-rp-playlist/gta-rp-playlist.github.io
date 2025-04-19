// Function to get URL parameters
function getUrlParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Function to update the URL with missing parameters
function updateUrlParam(param, value) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set(param, value);
    url.search = params.toString();
    window.history.replaceState({}, '', url.href);
}

// Function to handle category and server parameters
function handleParameters() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'Unknown'; // Fallback to 'Unknown' if not present
    const limitStreams = parseInt(params.get('limitstreams')) || 25; // Default to 25 if not specified
    let server = params.get('server');

    // Set server to 'prodigy' if not specified
    if (!server) {
        server = 'prodigy';
        updateUrlParam('server', server);
    }

    // Set the category title
    document.getElementById('categoryTitle').textContent = `Showing ${limitStreams} Streams in ${category}`;

    // Determine the source based on the server parameter
    const fetchSource = server === 'prodigy' ? 'prodigy.html' : 'index.html';

    fetch(fetchSource)  // Fetch the content from the appropriate source
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            // Select streams for the specific category
            const streams = doc.querySelectorAll(`.sub-item[data-category="${category}"]`);
            // Call function to handle streams
            showCategoryStreams(category, streams);
        })
        .catch(error => console.error('Error fetching streams:', error));
}

// Run the parameter handling function when the page loads
window.onload = function() {
    handleParameters();
};
