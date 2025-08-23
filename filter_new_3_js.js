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

        const hideElementsWithFade = () => {
            const hideDuration = 6000; // 6 seconds
            const fadeDuration = 500;  // fade-in

            const elementsToHide = [
                playerDiv.querySelector("button"),
                playerDiv.querySelector(".platform-label"),
                overlay
            ].filter(Boolean);

            elementsToHide.forEach(el => {
                el.style.transition = `opacity ${fadeDuration}ms ease`;
                el.style.opacity = 0;
                el.style.display = "none";
            });

            setTimeout(() => {
                elementsToHide.forEach(el => {
                    el.style.display = "block";
                    el.style.opacity = 0;
                    requestAnimationFrame(() => el.style.opacity = 1);
                });
            }, hideDuration);
        };

        hideElementsWithFade();

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

            // Hide overlay, delete button, platform label again on reload
            hideElementsWithFade();
        };

        const switchToPlayer = () => {
            if (activePlayer === playerId) return;

            document.querySelectorAll(".twitch-embed").forEach((div) => {
                if (div.id !== playerId) resetZoom(div);

                const isKickDiv = !!div.querySelector("iframe[src*='kick.com']");
                const usernameDiv = div.getAttribute("data-username");
                const currentVolume = div.getAttribute("data-volume");

                if (currentVolume !== "playermuted") {
                    div.classList.remove("current-unmuted");
                    div.setAttribute("data-volume", "playermuted");

                    if (players[div.id]) players[div.id].setMuted(true);

                    if (isKickDiv) {
                        div.innerHTML = "";

                        const iframe = document.createElement("iframe");
                        const cleanUsername = usernameDiv.toLowerCase().endsWith("-k") ? usernameDiv.slice(0, -2) : usernameDiv;
                        iframe.src = `https://player.kick.com/${cleanUsername}?muted=true&autoplay=true`;
                        iframe.frameBorder = "0";
                        iframe.allow = "autoplay; fullscreen";
                        Object.assign(iframe.style, { width: "100%", height: "100%" });
                        div.appendChild(iframe);

                        addPlatformLabel(div, usernameDiv, true);
                        addDeleteButton(div);

                        const newOverlay = document.createElement("div");
                        newOverlay.className = "overlay";
                        div.insertBefore(newOverlay, div.firstChild);
                        newOverlay.addEventListener("wheel", wheelHandler, { passive: false });

                        // Hide overlay, delete button, platform label on switch
                        const hideOverlayElements = [
                            div.querySelector("button"),
                            div.querySelector(".platform-label"),
                            newOverlay
                        ].filter(Boolean);
                        hideOverlayElements.forEach(el => {
                            el.style.transition = `opacity 500ms ease`;
                            el.style.opacity = 0;
                            el.style.display = "none";
                        });
                        setTimeout(() => {
                            hideOverlayElements.forEach(el => {
                                el.style.display = "block";
                                el.style.opacity = 0;
                                requestAnimationFrame(() => el.style.opacity = 1);
                            });
                        }, 6000);
                    }
                }
            });

            if (players[playerId]) players[playerId].setMuted(false);
            else if (isKick) {
                const currentVolume = playerDiv.getAttribute("data-volume");
                if (currentVolume !== "playerunmuted") reloadKickPlayer(playerDiv, username, false);
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

            const padding = 20;
            const maxScaleWidth = (viewportWidth - padding * 2) / originalWidth;
            const maxScaleHeight = (viewportHeight - padding * 2) / originalHeight;
            const maxScale = Math.min(maxScaleWidth, maxScaleHeight, 5);

            let prevScale = playerDiv._scale;

            if (delta < 0) playerDiv._scale = Math.min(playerDiv._scale + scaleStep, maxScale);
            else if (delta > 0 && playerDiv._scale > 1) playerDiv._scale = Math.max(1, playerDiv._scale - scaleStep);

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
