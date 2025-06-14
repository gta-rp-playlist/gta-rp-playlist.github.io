document.addEventListener("DOMContentLoaded", async function () {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const urlParams = new URLSearchParams(window.location.search);
    const server = urlParams.get("server") || "nopixel";
    const quality = urlParams.get("quality") || "high";
    const usernames = Array.from(new Set(urlParams.getAll("username")));
    const categories = urlParams.getAll("category");
    const mappedCategories = categories.map(cat => categoryMappings[cat.toLowerCase()] || cat);
    let limitStreams = parseInt(urlParams.get("limitstreams"), 10);

    if (!urlParams.toString()) {
        return handleDefaultCategory();
    }

    setDefaultParams();
    const fetchSource = server === "prodigy" ? "data2.txt" : "data.txt";
    const data = await fetch(fetchSource).then(r => r.text()).catch(console.error);
    const doc = new DOMParser().parseFromString(data, "text/html");

    const usernamesList = document.getElementById("usernamesList");

    if (usernames.length > 0 && categories.length === 0) {
        // Only usernames present, no categories
        renderUserStreams(usernames, usernamesList);
    } else if (usernames.length > 0 && categories.length > 0) {
        // Both usernames and categories, merge results as you do
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
        // No usernames, only categories
        const orderedUsernames = getTopStreamsByCategory(doc, mappedCategories, limitStreams);
        renderUserStreams(orderedUsernames.map(({ username }) => username), usernamesList, orderedUsernames);
    }

    initializePlayers();
    await delay(950);
    window.dispatchEvent(new Event("resize"));

    // ---- Helper Functions ----

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
        if (!urlParams.has("quality")) {
            urlParams.set("quality", quality);
        }

        if (usernames.length === 0 && (isNaN(limitStreams) || limitStreams <= 0)) {
            limitStreams = 25;
            urlParams.set("limitstreams", limitStreams);
        }

        window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`);
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
                if (index === 0) twitchPlayer.setMuted(false);
            }

            if (index === 0) div.classList.add("current-unmuted");
        });

        // Optional: show category status
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

                // Reset all players first
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
                            // Only reload if volume state changed
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

                // Activate (unmute) the current player
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
