const players = {}; // Define the players object globally
let currentPlayerIndex = 1; // Start with player1
let playerList = []; // To keep track of players in order
let playerPositions = {}; // To keep track of players' positions in the grid

// Dynamically load streams based on category and server from URL
const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const limitStreams = parseInt(params.get('limitstreams')) || 25; // Default to 25 if not specified
const server = params.get('server') || 'index'; // Default to 'index' if not specified

// Check for usernames parameter
const usernames = params.getAll('username');

function initializePlayers() {
    const playerElements = document.querySelectorAll('.twitch-embed');
    playerList = Array.from(playerElements).map(el => el.id); // Update playerList with current players

    // Track player positions in the grid
    playerPositions = {};
    playerElements.forEach((el, index) => {
        const row = Math.floor(index / 4); // Assuming 4 columns in grid
        const col = index % 4;
        playerPositions[el.id] = { row, col };
    });

    // Mute all players initially except the one being hovered over later
    playerList.forEach(playerId => {
        setVolume(playerId, 0.0);  // Mute all players by default
        document.getElementById(playerId)?.classList.remove('current-unmuted');  // Remove the unmuted class
    });

    updateCurrentUnmutedClass(); // Ensure that the class for the unmuted player is updated
    addMouseEvents(); // Attach mouse event listeners for hover actions
}

function updateCurrentUnmutedClass() {
    document.querySelectorAll('.twitch-embed').forEach(playerElement => {
        playerElement.classList.remove('current-unmuted');
    });
    const currentPlayerElement = document.getElementById(`player${currentPlayerIndex}`);
    if (currentPlayerElement) {
        currentPlayerElement.classList.add('current-unmuted');
    }
}

function setVolume(playerId, volume) {
    const playerElement = document.getElementById(playerId);
    
    // Check if the player is a Kick stream by looking for an iframe with a Kick URL
    const isKickStream = playerElement && playerElement.querySelector('iframe[src^="https://player.kick.com/"]');
    
    // Skip if it's a Kick stream
    if (isKickStream) {
        console.log(`Skipping volume setting for Kick stream: ${playerId}`);
        return;  // Skip setting volume for Kick streams
    }

    const player = players[playerId];
    if (player) {
        console.log(`Setting volume for ${playerId} to ${volume}`);
        player.setVolume(volume);  // Set the volume for Twitch players
    } else {
        console.error(`Player ${playerId} not found`);
    }
}


function muteAllPlayers(exceptPlayerId) {
    playerList.forEach(playerId => {
        if (playerId !== exceptPlayerId) {
            setVolume(playerId, 0.0);
            document.getElementById(playerId)?.classList.remove('current-unmuted'); // Remove class from other players
        }
    });
}

function adjustLayout(streamCount) {
    const container = document.getElementById('usernamesList');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const aspectRatio = 16 / 9;

    let optimalColumns = 1;
    let optimalRows = streamCount;
    let maxIframeHeight = 0;
    let maxIframeWidth = 0;

    for (let columns = 1; columns <= streamCount; columns++) {
        const columnWidth = containerWidth / columns;
        const rowHeight = columnWidth / aspectRatio;
        const rows = Math.ceil(streamCount / columns);
        const totalHeight = rowHeight * rows;

        if (totalHeight <= containerHeight && rowHeight > maxIframeHeight) {
            optimalColumns = columns;
            optimalRows = rows;
            maxIframeHeight = rowHeight;
            maxIframeWidth = columnWidth;
        }
    }

    container.style.gridTemplateColumns = `repeat(${optimalColumns}, 1fr)`;
    container.style.gridAutoRows = `${maxIframeHeight}px`;
}

let hoverTimeout = null;
let lastUnmutedPlayer = `player${currentPlayerIndex}`; // Track the last unmuted player
let pendingUnmutePlayer = null; // Track the player that might be unmuted

function addMouseEvents() {
    document.querySelectorAll('.twitch-embed').forEach(playerElement => {
        playerElement.addEventListener('mouseenter', function () {
            clearTimeout(hoverTimeout); // Clear any pending mute action
            const playerId = playerElement.id;

            // Start a timer; only unmute if hovered for 1.2 seconds
            hoverTimeout = setTimeout(() => {
                if (playerId !== lastUnmutedPlayer) {
                    muteAllPlayers(playerId); // Mute all others
                    setVolume(playerId, 1.0); // Unmute hovered player
                    playerElement.classList.add('current-unmuted'); // Highlight hovered player
                    lastUnmutedPlayer = playerId; // Update the last unmuted player
                }
            }, 1200);

            pendingUnmutePlayer = playerId; // Track which player is pending for unmute
        });

        playerElement.addEventListener('mouseleave', function () {
            // Cancel unmute if the player is left before 1.2 seconds
            if (pendingUnmutePlayer === playerElement.id) {
                clearTimeout(hoverTimeout);
                pendingUnmutePlayer = null;
            }
        });
    });
}

// Mute all players except the one being hovered over
function muteAllPlayers(exceptPlayerId) {
    playerList.forEach(playerId => {
        if (playerId !== exceptPlayerId) {
            setVolume(playerId, 0.0);
            document.getElementById(playerId)?.classList.remove('current-unmuted');
        }
    });
}
// Mute all players except player1
function muteAllPlayersExceptPlayer1() {
    playerList.forEach(playerId => {
        if (playerId !== 'player1') {
            setVolume(playerId, 0.0);  // Mute the player
            document.getElementById(playerId)?.classList.remove('current-unmuted');  // Remove the 'current-unmuted' class
        }
    });
}

window.onload = function () {
    initializePlayers();
};

// Add event listener for window resize to adjust the layout dynamically
window.addEventListener('resize', function () {
    const streamCount = document.querySelectorAll('#usernamesList iframe').length;
    if (streamCount > 0) {
        adjustLayout(streamCount);
    }
});

// Add event listeners for arrow key navigation
window.addEventListener('keydown', function (event) {
    const totalPlayers = playerList.length; // Get total number of players

    if (event.key === 'ArrowRight') {
        // Move to the next player
        currentPlayerIndex++;
        if (currentPlayerIndex > totalPlayers) {
            currentPlayerIndex = 1; // Wrap around to the first player
        }
        initializePlayers(); // Reinitialize players with new current player unmuted
    }

    if (event.key === 'ArrowLeft') {
        // Move to the previous player
        currentPlayerIndex--;
        if (currentPlayerIndex < 1) {
            currentPlayerIndex = totalPlayers; // Wrap around to the last player
        }
        initializePlayers(); // Reinitialize players with new current player unmuted
    }
});
