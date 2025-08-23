function revealElementsAfterDelay(elementIds, delay = 4000, fadeDuration = 1000) {
  const elements = elementIds.map(id => document.getElementById(id)).filter(Boolean);

  setTimeout(() => {
    elements.forEach(el => {
      el.style.display = "block";        // show element
      el.style.opacity = 0;              // start transparent
      el.style.transition = `opacity ${fadeDuration}ms ease`;
      requestAnimationFrame(() => {
        el.style.opacity = 1;            // fade in
      });
    });
  }, delay);
}

function playStream(streamName) {
    const player = document.getElementById('player');
    const chat = document.getElementById('chat');
    const lowerCaseStreamName = streamName.toLowerCase();

    const streamElement = Array.from(document.querySelectorAll('.sub-item')).find(item =>
        item.querySelector('.username').textContent.trim().toLowerCase() === lowerCaseStreamName
    );

    if (!streamElement) return;

    const title = streamElement.getAttribute('data-title') || '';
    const isKickStream = title.includes("🟢🟢Kick Stream☝️");

    if (isKickStream) {
        player.src = `https://player.kick.com/${lowerCaseStreamName}?muted=false&autoplay=true`;
        chat.src = `https://streamcompanion.app/kick/${lowerCaseStreamName}/chat`;
    } else {
        player.src = `https://player.twitch.tv/?channel=${streamName}&parent=gta-rp-playlist.com&parent=127.0.0.1&autoplay=true&muted=false&quality=chunked`;
        chat.src = `https://www.twitch.tv/embed/${streamName}/chat?parent=gta-rp-playlist.com&parent=127.0.0.1&darkpopout`;
    }

    const streamInfo = document.getElementById('streamInfo');
    const displayTitle = title.replace(/🟢🟢Kick Stream☝️/g, '').trim();
    streamInfo.innerHTML = `<div class="stream-name">${streamName}</div><div class="stream-title">${displayTitle}</div>`;

    highlightClickedUsername(lowerCaseStreamName);

    // Fade out immediately
    ["top-menu", "chat", "streamInfo"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.transition = "opacity 0.5s ease";
            el.style.opacity = 0;
            // Fully hide after fade out
            setTimeout(() => { el.style.display = "none"; }, 500);
        }
    });

    // Fade back in after 4 seconds
    revealElementsAfterDelay(["top-menu", "chat", "streamInfo"], 4000, 1000);
}
