const players = {}; // Define the players object globally
let currentPlayerIndex = 1; // Start with player1
let playerList = []; // To keep track of players in order
let playerPositions = {}; // To keep track of players' positions in the grid
// Dynamically load streams based on category and server from URL
const params = new URLSearchParams(window.location.search);




// Check for usernames parameter
const usernames = params.getAll('username');
function checkResolution() {
    const width = window.screen.width;

    if (width === 2560) {
        console.log("This is a 2K resolution monitor");
    } else if (width === 1920) {
        console.log("This is a 1080p resolution monitor");
    } else {
        console.log("This is not a 2K or 1080p resolution monitor");
    }
}



function showCategoryStreams(category, streams) {
    const params = new URLSearchParams(window.location.search);
    const limitStreams = parseInt(params.get('limitstreams')) || 25; // Default to 25 if not specified
    let server = params.get('server') || 'unknown'; // Default to 'unknown' if not specified

    // Capitalize the first letter of the server name
    server = server.charAt(0).toUpperCase() + server.slice(1);

    const uniqueStreams = Array.from(streams).filter(function(stream, index, self) {
        const username = stream.querySelector('.username').textContent.trim().toLowerCase();
        return index === self.findIndex(function(s) {
            return s.querySelector('.username').textContent.trim().toLowerCase() === username;
        });
    });

    const sortedStreams = uniqueStreams.sort((a, b) => {
        const viewersA = parseInt(a.getAttribute('data-viewers').replace(/[^0-9]/g, '')) || 0;
        const viewersB = parseInt(b.getAttribute('data-viewers').replace(/[^0-9]/g, '')) || 0;
        return viewersB - viewersA;
    });

    const topStreams = sortedStreams.slice(0, limit);
    document.getElementById('categoryTitle').textContent = `Showing ${topStreams.length} Streams in ${category} on server ${server}`;

    const container = document.getElementById('usernamesList');
    container.innerHTML = '';

    if (topStreams.length === 1) {
        container.classList.add('single-stream');
    } else {
        container.classList.remove('single-stream');
    }

    topStreams.forEach((stream, index) => {
        const username = stream.querySelector('.username').textContent.trim().toLowerCase();
        const title = stream.getAttribute('data-title').trim();

        console.log(`Processing stream: ${username}, Title: ${title}`);

        const streamEmbed = document.createElement('div');
        streamEmbed.className = 'twitch-embed';
        streamEmbed.id = `player${index + 1}`;
        container.appendChild(streamEmbed);

        if (title.includes("🟢🟢Kick Stream☝️")) {
            console.log(`Embedding Kick player for ${username}`);

            const kickIframe = document.createElement('iframe');
            kickIframe.src = `https://player.kick.com/${username}?muted=${index === 0 ? 'false' : 'true'}&autoplay=true`;
            kickIframe.frameBorder = "0";
            kickIframe.allow = "autoplay; fullscreen";
            kickIframe.style.width = "100%";
            kickIframe.style.height = "100%";

            document.getElementById(`player${index + 1}`).appendChild(kickIframe);
        } else {
            console.log(`Embedding Twitch player for ${username}`);

            const player = new Twitch.Embed(`player${index + 1}`, {
                width: '100%',
                height: '100%',
                channel: username,
                parent: ["127.0.0.1", "gta-rp-playlist.com"],
                muted: false,
                layout: 'video'
            });

            player.addEventListener(Twitch.Embed.VIDEO_READY, () => {
                players[`player${index + 1}`] = player; // Store the player in the global players object

                if (index === 0) {
                    player.setVolume(1.0); // Unmute the first player
                    document.getElementById(`player${index + 1}`).classList.add('current-unmuted');
                } else {
                    player.setVolume(0.0); // Mute all other players
                }
            });
        }
    });

    adjustLayout(topStreams.length);
}


function updateCurrentUnmutedClass() {
    const playerElements = document.querySelectorAll('.twitch-embed');
    playerElements.forEach(playerElement => {
        playerElement.classList.remove('current-unmuted');
    });
    const currentPlayerElement = document.getElementById(`player${currentPlayerIndex}`);
    if (currentPlayerElement) {
        currentPlayerElement.classList.add('current-unmuted');
    }
}
function setVolume(playerId, volume) {
    const player = players[playerId];
    if (player) {
        console.log(`Setting volume for ${playerId} to ${volume}`);
        player.setVolume(volume);
    } else {
        console.error(`Player ${playerId} not found`);
    }
}

function muteAllPlayers(exceptPlayerId) {
    playerList.forEach(playerId => {
        if (playerId !== exceptPlayerId) {
            setVolume(playerId, 0.0);
        }
    });
}
function adjustLayout(streamCount) {
    const container = document.getElementById('usernamesList');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const aspectRatio = 16 / 9;

    // Reset display properties to flexbox for centering
    container.style.display = 'flex';
    container.style.justifyContent = 'center'; // Center horizontally
    container.style.alignItems = 'center';     // Center vertically
    container.style.height = '100vh';          // Full window height
    container.style.width = '100vw';           // Full window width

    if (streamCount === 1) {
        // Calculate the largest player size while maintaining 16:9 ratio
        let playerWidth = containerWidth;
        let playerHeight = playerWidth / aspectRatio;

        // If height is too large to fit, adjust width accordingly
        if (playerHeight > containerHeight) {
            playerHeight = containerHeight;
            playerWidth = playerHeight * aspectRatio;
        }

        // Apply the calculated size to the player container
        container.style.width = `${playerWidth}px`;
        container.style.height = `${playerHeight}px`;
        container.style.display = 'flex'; // Ensure flexbox is used for centering
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.gridTemplateColumns = 'none'; // Ensure no grid styles are applied
        container.style.gridAutoRows = 'auto'; // Ensure no grid row sizes are applied

    } else if (streamCount === 4) {
        // Handle 2x2 grid for 4 players
        container.style.display = 'grid';
        const columns = 2;
        const rows = 2;

        const columnWidth = containerWidth / columns;
        const rowHeight = columnWidth / aspectRatio;

        const totalHeight = rowHeight * rows;
        if (totalHeight > containerHeight) {
            const adjustedRowHeight = containerHeight / rows;
            const adjustedColumnWidth = adjustedRowHeight * aspectRatio;

            container.style.gridTemplateColumns = `repeat(${columns}, ${adjustedColumnWidth}px)`;
            container.style.gridAutoRows = `${adjustedRowHeight}px`;
        } else {
            container.style.gridTemplateColumns = `repeat(${columns}, ${columnWidth}px)`;
            container.style.gridAutoRows = `${rowHeight}px`;
        }

    } else if (streamCount === 3) {
        // Pyramid layout for 3 players
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 1fr'; // Two columns
        container.style.gridTemplateRows = '1fr 1fr'; // Two rows
        container.style.gridTemplateAreas = `
            "a b"
            "c c"
        `;

        const columnWidth = containerWidth / 2;
        const rowHeight = columnWidth / aspectRatio;

        const totalHeight = rowHeight * 2;
        if (totalHeight > containerHeight) {
            const adjustedRowHeight = containerHeight / 2;
            const adjustedColumnWidth = adjustedRowHeight * aspectRatio;

            container.style.gridTemplateColumns = `repeat(2, ${adjustedColumnWidth}px)`;
            container.style.gridAutoRows = `${adjustedRowHeight}px`;
        } else {
            container.style.gridTemplateColumns = `repeat(2, ${columnWidth}px)`;
            container.style.gridAutoRows = `${rowHeight}px`;
        }

        // Ensure proper placement of players
        const areas = ['player1', 'player2', 'player3'];
        container.querySelectorAll('.player').forEach((player, index) => {
            player.style.gridArea = areas[index];
        });
        
    } else {
        // Default behavior for other stream counts
        container.style.display = 'grid';
        let optimalColumns = 1;
        let optimalRows = streamCount;
        let maxIframeHeight = 0;
        let maxIframeWidth = 0;

        for (let columns = 1; columns <= streamCount; columns++) {
            const rows = Math.ceil(streamCount / columns);
            const columnWidth = containerWidth / columns;
            const rowHeight = columnWidth / aspectRatio;
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
}

window.addEventListener('resize', function() {
});

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;

    const categoryMapping = {
        'cops': '01Cops',
        'bcso': '03BCSO',
        'lspd': '02LSPD',
        'independent': '57Independent',  
        'cg': '36CG',
        'cg_2': '37CG_2',
        'cg2': '37CG_2', 
        'ncypress': '09NCypress',
        'n_cypress': '09NCypress',
        'nourf': '09NCypress',
        'scypress': '09SCypress',
        's_cypress': '09SCypress',
        'souf': '09SCypress',
        'faceless': '30Faceless',
    };

    let server;
    if (currentPath.includes('prodigy.html')) {
        server = params.get('server') || 'prodigy'; // Default to 'prodigy' if not specified
        localStorage.setItem('source', 'prodigy');
    } else if (currentPath.includes('index.html')) {
        server = params.get('server') || 'nopixel'; // Default to 'nopixel' if not specified
        localStorage.setItem('source', 'index');
    }

    if ((currentPath.includes('index.html') || currentPath.includes('prodigy.html')) && params.has('category')) {
        let category = params.get('category').toLowerCase();

        if (categoryMapping[category]) {
            category = categoryMapping[category];
        }

        // Get the limitstreams parameter if it exists
        const limitStreams = params.get('limitstreams') || 25; // Default to 25 if not specified

        window.location.href = `grid.html?category=${category}&limitstreams=${limitStreams}&server=${server}`;
    } else {
        var firstCategory = document.querySelector('.category');
        if (firstCategory) {
            var firstStreamName = document.querySelector('.sub-item[data-category="' + firstCategory.dataset.category + '"] .username').textContent.trim().toLowerCase();
            playStream(firstStreamName);
        }

        document.querySelectorAll('.category').forEach(categoryElement => {
            updateSidebarCategoryCount(categoryElement.dataset.category);
        });
    }
};


// Add event listener for window resize to adjust the layout dynamically
window.addEventListener('resize', function() {
    const streamCount = document.querySelectorAll('#usernamesList iframe').length;
    if (streamCount > 0) {
        adjustLayout(streamCount);
    }
});

window.addEventListener('keydown', function(event) {
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
