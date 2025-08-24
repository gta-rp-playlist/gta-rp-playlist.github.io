const players = {};
let currentPlayerIndex = 1;
let playerList = [];
let playerPositions = {};
function getPlayerQuality(quality) {
    return "chunked";
}
const params = new URLSearchParams(window.location.search);
const usernames = params.getAll('username');

function addDeleteButton(div) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    Object.assign(deleteBtn.style, {
        position: "absolute",
        top: "4px",
        right: "4px",
        background: "transparent",
        border: "none",
        color: "red",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        zIndex: 10001,
        padding: "0",
        lineHeight: "1",
        userSelect: "none",
    });
    deleteBtn.title = "Remove stream";

    deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    div.remove();

    setTimeout(() => {
        const container = document.getElementById('usernamesList');
        const streamCount = container.querySelectorAll('.twitch-embed').length;

        if (streamCount === 1) {
            container.classList.add('single-stream');
        } else {
            container.classList.remove('single-stream');
        }

        adjustLayout(streamCount);

        const remainingStreams = container.querySelectorAll('.twitch-embed');
        remainingStreams.forEach(resetZoom);
    }, 0);
});

    div.appendChild(deleteBtn);
}
function resetZoom(playerDiv) {
    playerDiv._scale = 1;
    playerDiv._isCentered = false;
    playerDiv._translateX = 0;
    playerDiv._translateY = 0;
    playerDiv.style.transformOrigin = "";
    playerDiv.style.transform = "translate(0px, 0px) scale(1)";
    playerDiv.style.zIndex = "";
}

function addPlatformLabel(div, username, isKick) {
  const oldLabel = div.querySelector(".platform-label");
  if (oldLabel) oldLabel.remove();

  const label = document.createElement("a");
  label.className = "platform-label";
  label.textContent = isKick ? "K" : "T";

  const cleanUsername = username.toLowerCase().endsWith("-k") ? username.slice(0, -2) : username;
  label.href = isKick
    ? `https://kick.com/${cleanUsername}`
    : `https://twitch.tv/${username}`;
  label.target = "_blank";
  label.rel = "noopener noreferrer";

  Object.assign(label.style, {
    position: "absolute",
    top: "6px",
    left: "6px",
    fontSize: "16px",
    fontWeight: "700",
    color: isKick ? "#00e701" : "#6441a5",
    textDecoration: "none",
    userSelect: "none",
    zIndex: 10000,
    cursor: "pointer",
    padding: "0 4px",
    backgroundColor: "transparent",
  });

  div.style.position = "relative";

  div.appendChild(label);
}

function adjustLayout(streamCount) {
    const container = document.getElementById('usernamesList');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const aspectRatio = 16 / 9;
    container.style.display = 'grid';
    container.style.height = '100vh';
    container.style.width = '100vw';

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

window.onload = function () {
    const addButton = document.getElementById('add-group-button');
    const addInput = document.getElementById('add-group-input');

    if (addButton && addInput) {
        addButton.addEventListener('click', function () {
            const input = addInput.value.trim().toLowerCase();
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

    const usernames = Array.from(new Set(urlParams.getAll("username")));
    const categories = urlParams.getAll("category");
    const mappedCategories = categories.map(cat => categoryMappings[cat.toLowerCase()] || cat);

    if (!urlParams.toString()) return handleDefaultCategory();

    const fetchSource = "data.txt";
    const data = await fetch(fetchSource).then(r => r.text()).catch(console.error);
    const doc = new DOMParser().parseFromString(data, "text/html");
    const usernamesList = document.getElementById("usernamesList");

    if (usernames.length && !categories.length) {
        renderUserStreams(usernames, usernamesList);
    } else if (usernames.length && categories.length) {
        const orderedUsernames = getTopStreamsByCategory(doc, mappedCategories);
        const usernameStreams = usernames.map(username => {
            const found = orderedUsernames.find(u => u.username === username);
            return found || { username, title: "", viewers: 0 };
        });

        const combined = [
            ...orderedUsernames,
            ...usernameStreams.filter(u => !orderedUsernames.some(ou => ou.username === u.username))
        ];

        renderUserStreams(combined.map(u => u.username), usernamesList, combined);
    } else {
        const orderedUsernames = getTopStreamsByCategory(doc, mappedCategories);
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
                urlParams.set("category", defaultCategory);
                window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`);
                location.reload();
                return;
            }
        }
    }

    function getTopStreamsByCategory(doc, categories) {
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
        return Array.from(new Map(combinedStreams.map(s => [s.username, s])).values());
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
            div.style.position = "relative";

            // Create and add delete button
            addDeleteButton(div);

            container.appendChild(div);

            const isKick = title.includes("Kick") || username.toLowerCase().includes("kick") || username.toLowerCase().endsWith("-k");
            const cleanUsername = username.toLowerCase().endsWith("-k") ? username.slice(0, -2) : username;

            addPlatformLabel(div, username, isKick);

            if (isKick) {
                const iframe = document.createElement("iframe");
                iframe.src = `https://player.kick.com/${cleanUsername}?muted=${index !== 0}&autoplay=true`;
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
                        playerObj.setQuality(getPlayerQuality("chunked"));
                    }

                    if (index === 0) {
                        twitchPlayer.setMuted(false);
                    }
                });
            }

            if (index === 0) {
                div.classList.add("current-unmuted");
            } else {
                div.classList.add("muted");
            }
        });

        if (extraInfo.length) {
            const titleEl = document.getElementById("categoryTitle");
            titleEl.textContent = `Showing ${usernames.length} Streams in ${mappedCategories.join(", ")}`;
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

            let overlay = playerDiv.querySelector(".overlay");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.className = "overlay";
                playerDiv.insertBefore(overlay, playerDiv.firstChild);
            }

            const reloadKickPlayer = (div, user, muted) => {
                const currentVolume = div.getAttribute("data-volume");
                const desired = muted ? "playermuted" : "playerunmuted";
                if (currentVolume === desired) return;

                div.innerHTML = "";

                const newOverlay = document.createElement("div");
                newOverlay.className = "overlay";
                div.appendChild(newOverlay);

                const iframe = document.createElement("iframe");
                const cleanUsername = user.toLowerCase().endsWith("-k") ? user.slice(0, -2) : user;
                iframe.src = `https://player.kick.com/${cleanUsername}?muted=${muted}&autoplay=true`;
                iframe.frameBorder = "0";
                iframe.allow = "autoplay; fullscreen";
                Object.assign(iframe.style, { width: "100%", height: "100%" });
                div.appendChild(iframe);

                addPlatformLabel(div, user, true);
                addDeleteButton(div);

                div.setAttribute("data-volume", desired);
                div.classList.toggle("current-unmuted", !muted);

                newOverlay.addEventListener("wheel", wheelHandler, { passive: false });
            };

            const switchToPlayer = () => {
                if (activePlayer === playerId) return;

                document.querySelectorAll(".twitch-embed").forEach((div) => {
                    if (div.id !== playerId) {
                        resetZoom(div);
                    }
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
                            const cleanUsername = username.toLowerCase().endsWith("-k") ? username.slice(0, -2) : username;
                            iframe.src = `https://player.kick.com/${cleanUsername}?muted=true&autoplay=true`;
                            iframe.frameBorder = "0";
                            iframe.allow = "autoplay; fullscreen";
                            Object.assign(iframe.style, { width: "100%", height: "100%" });
                            div.appendChild(iframe);

                            addPlatformLabel(div, username, true);
                            addDeleteButton(div);

                            const newOverlay = document.createElement("div");
                            newOverlay.className = "overlay";
                            div.insertBefore(newOverlay, div.firstChild);
                            newOverlay.addEventListener("wheel", wheelHandler, { passive: false });
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

            const wheelHandler = (e) => {
    if (!playerDiv.classList.contains("current-unmuted")) return;

    e.preventDefault();

    const delta = e.deltaY;
    const scaleStep = 0.25;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (!playerDiv._scale) playerDiv._scale = 1;
    if (!playerDiv._isCentered) playerDiv._isCentered = false;

    const rect = playerDiv.getBoundingClientRect();
    const originalWidth = rect.width / playerDiv._scale;
    const originalHeight = rect.height / playerDiv._scale;

    // Calculate max scale so scaled player fits viewport with some padding (optional)
    const padding = 20; // px padding from edges

    const maxScaleWidth = (viewportWidth - padding * 2) / originalWidth;
    const maxScaleHeight = (viewportHeight - padding * 2) / originalHeight;
    const maxScale = Math.min(maxScaleWidth, maxScaleHeight, 5); // max 5 just as upper hard limit

    let prevScale = playerDiv._scale;

    if (delta < 0) {
        playerDiv._scale = Math.min(playerDiv._scale + scaleStep, maxScale);
    } else if (delta > 0 && playerDiv._scale > 1) {
        playerDiv._scale = Math.max(1, playerDiv._scale - scaleStep);
    }

    if (prevScale === 1 && playerDiv._scale > 1) {
        const viewportCenterX = viewportWidth / 2;
        const viewportCenterY = viewportHeight / 2;

        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        playerDiv._translateX = viewportCenterX - elementCenterX;
        playerDiv._translateY = viewportCenterY - elementCenterY;
        playerDiv._isCentered = true;
    }

    if (playerDiv._scale === 1) {
        playerDiv._isCentered = false;
        playerDiv.style.transformOrigin = "";
        playerDiv.style.transform = `translate(0px, 0px) scale(1)`;
        playerDiv.style.zIndex = "";
        return;
    }

    const tx = playerDiv._translateX || 0;
    const ty = playerDiv._translateY || 0;

    playerDiv.style.transformOrigin = "center center";
    playerDiv.style.transform = `translate(${tx}px, ${ty}px) scale(${playerDiv._scale})`;
    playerDiv.style.zIndex = 9999;
};

            playerDiv.addEventListener("mouseenter", () => {
                hoverTimeout = setTimeout(switchToPlayer, 1100);
            });

            playerDiv.addEventListener("mouseleave", () => {
                clearTimeout(hoverTimeout);
            });

            playerDiv.addEventListener("touchstart", switchToPlayer);

            overlay.addEventListener("wheel", wheelHandler, { passive: false });
        });
    }
});
