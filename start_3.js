// this filename is start_3.js

function playStream(streamName) {
    var player = document.getElementById('player');
    var chat = document.getElementById('chat');
    var lowerCaseStreamName = streamName.toLowerCase();

    var streamElement = Array.from(document.querySelectorAll('.sub-item')).find(function(item) {
        return item.querySelector('.username').textContent.trim().toLowerCase() === lowerCaseStreamName;
    });

    if (!streamElement) return;

    var title = streamElement.getAttribute('data-title') || '';
    var isKickStream = title.includes("🟢🟢Kick Stream☝️");

    if (isKickStream) {
        player.src = `https://player.kick.com/${lowerCaseStreamName}?muted=false&autoplay=true`;
        chat.src = `https://streamcompanion.app/kick/${lowerCaseStreamName}/chat`;
    } else {
        player.src = `https://player.twitch.tv/?channel=${streamName}&parent=gta-rp-playlist.com&parent=127.0.0.1&autoplay=true&muted=false&quality=chunked`;
        chat.src = `https://www.twitch.tv/embed/${streamName}/chat?parent=gta-rp-playlist.com&parent=127.0.0.1&darkpopout`;
    }

    var streamInfo = document.getElementById('streamInfo');
    var displayTitle = title.replace(/🟢🟢Kick Stream☝️/g, '').trim();
    streamInfo.innerHTML = `<div class="stream-name">${streamName}</div><div class="stream-title">${displayTitle}</div>`;

    highlightClickedUsername(lowerCaseStreamName);
}
