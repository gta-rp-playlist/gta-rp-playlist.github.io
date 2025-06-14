document.addEventListener('DOMContentLoaded', function() {
    fetch('changelog.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        const tooltip = document.querySelector('.tooltip');
        tooltip.innerHTML = data;  // Insert changelog text into tooltip
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});