const players = {}; // Define the players object globally
let currentPlayerIndex = 1; // Start with player1
let playerList = []; // To keep track of players in order
let playerPositions = {}; // To keep track of players' positions in the grid

const params = new URLSearchParams(window.location.search);
const usernames = params.getAll('username');

function updateSidebarCategoryCount(category) {
    // Your existing function implementation (if any)
}

function playStream(streamName) {
    // Your existing function implementation (if any)
}

function adjustLayout(streamCount) {
    // Your existing function implementation (if any)
}

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    let server;

    if (currentPath.includes('prodigy.html')) {
        server = params.get('server') || 'prodigy';
        localStorage.setItem('source', 'prodigy');
    } else if (currentPath.includes('nopixel.html')) {
        server = params.get('server') || 'nopixel';
        localStorage.setItem('source', 'index');
    }

    if ((currentPath.includes('nopixel.html') || currentPath.includes('prodigy.html')) && params.has('category')) {
        let category = params.get('category').toLowerCase();

        if (categoryMapping[category]) {
            category = categoryMapping[category];
        }

        const limitStreams = params.get('limitstreams') || 25;

        window.location.href = `filter.html?category=${category}&limitstreams=${limitStreams}&server=${server}`;
        return; // Important to prevent further execution
    } else {
        const firstCategory = document.querySelector('.category');
        if (firstCategory) {
            const firstStreamName = document.querySelector(`.sub-item[data-category="${firstCategory.dataset.category}"] .username`).textContent.trim().toLowerCase();
            playStream(firstStreamName);
        }

        document.querySelectorAll('.category').forEach(categoryElement => {
            updateSidebarCategoryCount(categoryElement.dataset.category);
        });
    }

    // Add group button and input event listeners
    const addButton = document.getElementById('add-group-button');
    const addInput = document.getElementById('add-group-input');

    if (addButton && addInput) {
        addButton.addEventListener('click', function () {
            const input = addInput.value.trim().toLowerCase();

            if (input === 'cypress') {
                alert('Be more specific. Type "scypress" or "ncypress".');
                return;
            }

            if (input) {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.append('category', input);
                window.location.href = currentUrl.toString();
            }
        });

        addInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addButton.click();
            }
        });
    }
};
    document.getElementById("add-username-button").addEventListener("click", () => {
      const input = document.getElementById("add-username-input");
      const username = input.value.trim();
      if (username) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.append("username", username);
        window.location.href = currentUrl.toString();
      }
    });
window.addEventListener('resize', function() {
    const streamCount = document.querySelectorAll('#usernamesList iframe').length;
    if (streamCount > 0) {
        adjustLayout(streamCount);
    }
});
