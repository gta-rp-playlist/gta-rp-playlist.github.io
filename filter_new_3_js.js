const players = {};
let currentPlayerIndex = 1;
let playerList = [];
let playerPositions = {};
function getPlayerQuality(quality) {
    if (!quality) return "chunked"; // Twitch's best
    switch (quality.toLowerCase()) {
        case "low":
            return "160p";
        case "medium":
            return "480p";
        case "high":
        default:
            return "chunked";
    }
}
const params = new URLSearchParams(window.location.search);
const usernames = params.getAll('username');

function updateSidebarCategoryCount(category) {
    // Implement if needed
}

function playStream(streamName) {
    // Implement if needed
}

function adjustLayout(streamCount) {
    const container = document.getElementById('usernamesList');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const aspectRatio = 16 / 9;

    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.width = '100vw';

    if (streamCount === 1) {
        let playerWidth = containerWidth;
        let playerHeight = playerWidth / aspectRatio;
        if (playerHeight > containerHeight) {
            playerHeight = containerHeight;
            playerWidth = playerHeight * aspectRatio;
        }
        container.style.width = `${playerWidth}px`;
        container.style.height = `${playerHeight}px`;
        container.style.gridTemplateColumns = 'none';
        container.style.gridAutoRows = 'auto';
    } else if (streamCount === 4) {
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
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 1fr';
        container.style.gridTemplateRows = '1fr 1fr';
        container.style.gridTemplateAreas = `"a b" "c c"`;
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

        const areas = ['player1', 'player2', 'player3'];
        container.querySelectorAll('.player').forEach((player, index) => {
            player.style.gridArea = areas[index];
        });
    } else {
        container.style.display = 'grid';
        let optimalColumns = 1;
        let optimalRows = streamCount;
        let maxIframeHeight = 0;

        for (let columns = 1; columns <= streamCount; columns++) {
            const rows = Math.ceil(streamCount / columns);
            const columnWidth = containerWidth / columns;
            const rowHeight = columnWidth / aspectRatio;
            const totalHeight = rowHeight * rows;

            if (totalHeight <= containerHeight && rowHeight > maxIframeHeight) {
                optimalColumns = columns;
                optimalRows = rows;
                maxIframeHeight = rowHeight;
            }
        }

        container.style.gridTemplateColumns = `repeat(${optimalColumns}, 1fr)`;
        container.style.gridAutoRows = `${maxIframeHeight}px`;
    }
}

window.onload = function () {
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
        return;
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

document.getElementById("add-username-button")?.addEventListener("click", () => {
    const input = document.getElementById("add-username-input");
    const username = input.value.trim();
    if (username) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.append("username", username);
        window.location.href = currentUrl.toString();
    }
});

window.addEventListener('resize', () => {
    const streamCount = document.querySelectorAll('#usernamesList iframe').length;
    if (streamCount > 0) adjustLayout(streamCount);
});

document.addEventListener("DOMContentLoaded", async () => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const urlParams = new URLSearchParams(window.location.search);
    const server = urlParams.get("server") || "nopixel";
    const quality = urlParams.get("quality") || "high";
    const usernames = Array.from(new Set(urlParams.getAll("username")));
    const categories = urlParams.getAll("category");
    const mappedCategories = categories.map(cat => categoryMappings[cat.toLowerCase()] || cat);
    let limitStreams = parseInt(urlParams.get("limitstreams"), 10);

    if (!urlParams.toString()) return handleDefaultCategory();

    setDefaultParams();
    const fetchSource = server === "prodigy" ? "data2.txt" : "data.txt";
    const data = await fetch(fetchSource).then(r => r.text()).catch(console.error);
    const doc = new DOMParser().parseFromString(data, "text/html");
    const usernamesList = document.getElementById("usernamesList");

    if (usernames.length && !categories.length) {
        renderUserStreams(usernames, usernamesList);
    } else if (usernames.length && categories.length) {
        const orderedUsernames = getTopStreamsByCategory(doc, mappedCategories, limitStreams);
        const usernameStreams = usernames.map(username => {
            const found = orderedUsernames.find(u => u.username === username);
            return found || { username, title: "", viewers: 0 };
        });

        const combined = [
            ...orderedUsernames,
            ...usernameStreams.filter(u => !orderedUsernames.some(ou => ou.username === u.username))
        ];

        const limitedStreams = combined.slice(0, limitStreams);
        renderUserStreams(limitedStreams.map(u => u.username), usernamesList, limitedStreams);
    } else {
        const orderedUsernames = getTopStreamsByCategory(doc, mappedCategories, limitStreams);
        renderUserStreams(orderedUsernames.map(u => u.username), usernamesList, orderedUsernames);
    }

    initializePlayers();
    await delay(950);
    window.dispatchEvent(new Event("resize"));

    async function handleDefaultCategory() {
        const data = await fetch("data.txt").then(r => r.text()).catch(console.error);
        const doc = new DOMParser().parseFromString(data, "text/html");
        const categoryOrder = Array.from({ length: 58 }, (_, i) => String(i + 1).padStart(2, '0'));

        for (const prefix of categoryOrder) {
            const match = doc.querySelector(`.sub-item[data-category^="${prefix}"]`);
            if (match) {
                const defaultCategory = match.getAttribute("data-category");
                urlParams.set("server", server);
                urlParams.set("category", defaultCategory);
                window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`);
                location.reload();
                return;
            }
        }
        console.warn("No matching category found in data.txt");
    }

function setDefaultParams() {
    // Set default limitStreams if invalid
    if (usernames.length === 0 && (isNaN(limitStreams) || limitStreams <= 0)) {
        limitStreams = 25;
        urlParams.set("limitstreams", limitStreams);
    }

    // Determine stream count (usernames count or limitStreams fallback)
    const streamCount = usernames.length || limitStreams;

    // Auto-set quality based on stream count, only if not already set
    if (!urlParams.has("quality")) {
        let autoQuality = "high";
        if (streamCount >= 13) {
            autoQuality = "low";
        } else if (streamCount >= 8) {
            autoQuality = "medium";
        }
        urlParams.set("quality", autoQuality);
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

    // Only reload if URL params changed to avoid reload loop
    if (window.location.search !== `?${urlParams.toString()}`) {
        window.history.replaceState({}, "", newUrl);
        window.location.reload();  // Force reload to apply new params
    }
}

    function getTopStreamsByCategory(doc, categories, limit) {
        let combinedStreams = [];
        for (const cat of categories) {
            const streams = Array.from(doc.querySelectorAll(`.sub-item[data-category="${cat}"]`));
            const sorted = streams.map((stream) => {
                const username = stream.querySelector(".username")?.textContent;
                const title = stream.getAttribute("data-title");
                const viewersText = stream.querySelector(".viewer-count")?.textContent || "";
                const viewers = parseInt(viewersText.replace(/[^0-9]/g, ""), 10);
                return { username, title, viewers };
            }).sort((a, b) => b.viewers - a.viewers);
            combinedStreams.push(...sorted);
        }
        return Array.from(new Map(combinedStreams.map(s => [s.username, s])).values()).slice(0, limit);
    }

    function renderUserStreams(usernames, container, extraInfo = []) {
        container.classList.toggle("single-stream", usernames.length === 1);

        usernames.forEach((username, index) => {
            const div = document.createElement("div");
            const info = extraInfo.find(u => u.username === username);
            const title = info?.title || "";

            div.className = "twitch-embed";
            div.id = `player${index + 1}`;
            div.setAttribute("data-username", username);
            div.setAttribute("data-volume", index === 0 ? "playerunmuted" : "playermuted");
            container.appendChild(div);

            const isKick = title.includes("Kick") || username.toLowerCase().includes("kick");
            if (isKick) {
                const iframe = document.createElement("iframe");
                iframe.src = `https://player.kick.com/${username}?muted=${index !== 0}&autoplay=true`;
                iframe.frameBorder = "0";
                iframe.allow = "autoplay; fullscreen";
                Object.assign(iframe.style, { width: "100%", height: "100%" });
                div.appendChild(iframe);
            } else {
                const twitchPlayer = new Twitch.Embed(div.id, {
                    width: "100%",
                    height: "100%",
                    channel: username,
                    parent: ["127.0.0.1", "gta-rp-playlist.com"],
                    muted: index !== 0,
                    layout: "video",
                });
                players[div.id] = twitchPlayer;

                twitchPlayer.addEventListener(Twitch.Embed.VIDEO_READY, () => {
                    const playerObj = twitchPlayer.getPlayer();
                    if (playerObj) {
                        const selectedQuality = getPlayerQuality(quality);
                        playerObj.setQuality(selectedQuality);
                        console.log(`Set quality for ${username} to ${selectedQuality}`);
                    }

                    if (index === 0) {
                        twitchPlayer.setMuted(false);
                    }
                });
            }

            if (index === 0) div.classList.add("current-unmuted");
        });

        if (extraInfo.length) {
            const titleEl = document.getElementById("categoryTitle");
            titleEl.textContent = `Showing ${usernames.length} Streams in ${mappedCategories.join(", ")} on server ${server}`;
            titleEl.style.display = "block";
            setTimeout(() => (titleEl.style.display = "none"), 4000);
        }
    }

    function initializePlayers() {
        const playersDivs = document.querySelectorAll(".twitch-embed");
        let activePlayer = null;

        playersDivs.forEach((playerDiv) => {
            const playerId = playerDiv.id;
            const username = playerDiv.getAttribute("data-username");
            const isKick = !!playerDiv.querySelector("iframe[src*='kick.com']");
            let hoverTimeout;

            const reloadKickPlayer = (div, user, muted) => {
                const currentVolume = div.getAttribute("data-volume");
                const desired = muted ? "playermuted" : "playerunmuted";
                if (currentVolume === desired) return;

                div.innerHTML = "";
                const iframe = document.createElement("iframe");
                iframe.src = `https://player.kick.com/${user}?muted=${muted}&autoplay=true`;
                iframe.frameBorder = "0";
                iframe.allow = "autoplay; fullscreen";
                Object.assign(iframe.style, { width: "100%", height: "100%" });
                div.appendChild(iframe);
                div.setAttribute("data-volume", desired);
                div.classList.toggle("current-unmuted", !muted);
            };

            const switchToPlayer = () => {
                if (activePlayer === playerId) return;

                document.querySelectorAll(".twitch-embed").forEach((div) => {
                    const isKick = !!div.querySelector("iframe[src*='kick.com']");
                    const username = div.getAttribute("data-username");
                    const currentVolume = div.getAttribute("data-volume");

                    if (currentVolume !== "playermuted") {
                        div.classList.remove("current-unmuted");
                        div.setAttribute("data-volume", "playermuted");

                        if (players[div.id]) {
                            players[div.id].setMuted(true);
                        }

                        if (isKick) {
                            div.innerHTML = "";
                            const iframe = document.createElement("iframe");
                            iframe.src = `https://player.kick.com/${username}?muted=true&autoplay=true`;
                            iframe.frameBorder = "0";
                            iframe.allow = "autoplay; fullscreen";
                            Object.assign(iframe.style, { width: "100%", height: "100%" });
                            div.appendChild(iframe);
                        }
                    }
                });

                if (players[playerId]) {
                    players[playerId].setMuted(false);
                } else if (isKick) {
                    const currentVolume = playerDiv.getAttribute("data-volume");
                    if (currentVolume !== "playerunmuted") {
                        reloadKickPlayer(playerDiv, username, false);
                    }
                }

                playerDiv.classList.add("current-unmuted");
                playerDiv.setAttribute("data-volume", "playerunmuted");
                activePlayer = playerId;
            };

            playerDiv.addEventListener("mouseenter", () => {
                hoverTimeout = setTimeout(switchToPlayer, 1100);
            });
            playerDiv.addEventListener("mouseleave", () => clearTimeout(hoverTimeout));
            playerDiv.addEventListener("touchstart", switchToPlayer);
        });
    }
});
