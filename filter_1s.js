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

    // ✅ Add this class to the container, not the iframe itself
    const playerContainer = document.getElementById(`player${index + 1}`);
    playerContainer.classList.add('twitch-embed');
    if (index === 0) {
        playerContainer.classList.add('current-unmuted');
    }

    // ✅ Track Kick players in playerList (useful for navigation)
    playerList.push(`player${index + 1}`);
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
