let selectedStreams = [];
let lastFetchedData = '';
let lastOpenedCategory = '';

// Preload all thumbnails on initial sidebar load (if needed)
function preloadThumbnails() {
  document.querySelectorAll('.sub-item').forEach(item => {
    const thumb = item.getAttribute('data-thumbnail');
    if (thumb) {
      const img = new Image();
      img.src = thumb;
    }
  });
}

// Remove all onclick="..." attributes from raw HTML string
function stripOnclickAttributes(htmlString) {
  return htmlString.replace(/onclick="[^"]*"/g, '');
}

// Bind click event to sidebar categories
function bindSidebarEvents() {
  document.querySelectorAll('#sidebar .category').forEach(cat => {
    cat.onclick = () => {
      highlightCategory(cat);
    };
  });
}

// Bind click events for grid items for selection toggling
function bindGridItemEvents() {
  document.querySelectorAll('.grid-item').forEach(item => {
    item.onclick = e => {
      if (e.target.classList.contains('remove-x')) return;
      toggleGridItemSelection(item);
    };
    const removeBtn = item.querySelector('.remove-x');
    if (removeBtn) {
      removeBtn.onclick = e => {
        e.stopPropagation();
        unselectGridItem(item);
      };
    }
  });
}

function toggleGridItemSelection(item) {
  const username = item.getAttribute('data-username');
  const platform = item.getAttribute('data-platform');
  const streamID = platform === 'kick' ? `${username}-k` : username;

  if (selectedStreams.includes(streamID)) {
    selectedStreams = selectedStreams.filter(s => s !== streamID);
    item.querySelector('.remove-x').style.display = 'none';
    item.classList.remove('selected');
  } else {
    selectedStreams.push(streamID);
    item.querySelector('.remove-x').style.display = 'block';
    item.classList.add('selected');
  }
  updateMultiURL();
}

function unselectGridItem(item) {
  const username = item.getAttribute('data-username');
  const platform = item.getAttribute('data-platform');
  const streamID = platform === 'kick' ? `${username}-k` : username;

  selectedStreams = selectedStreams.filter(s => s !== streamID);
  item.querySelector('.remove-x').style.display = 'none';
  item.classList.remove('selected');
  updateMultiURL();
}

function highlightCategory(el) {
  if (!el) return;
  document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
  el.classList.add('active');

  const category = el.getAttribute('data-category');
  lastOpenedCategory = category;

  let matchingItems = Array.from(document.querySelectorAll('.sub-item'))
    .filter(item => item.getAttribute('data-category') === category);

  matchingItems.sort((a, b) => {
    const viewersA = parseInt(a.getAttribute('data-viewers')) || 0;
    const viewersB = parseInt(b.getAttribute('data-viewers')) || 0;
    return viewersB - viewersA;
  });

  let gridHTML = `
    <div class="add-all-bar">
      <a href="#" id="add-all-link">+ Add All</a>
      &nbsp;|&nbsp;
      <a href="#" id="clear-all-link">✕ Clear All</a>
    </div>
    <div class="grid">
  `;

  // Track usernames to avoid duplicates
  const seenUsernames = new Set();

  matchingItems.forEach(item => {
  let title = item.getAttribute('data-title') || '';
  const timestamp = Date.now();
  const thumb = item.getAttribute('data-thumbnail') ? item.getAttribute('data-thumbnail') + '?cb=' + timestamp : '';
  const usernameSpan = item.querySelector('.username');
  const username = usernameSpan ? usernameSpan.textContent.trim() : '';
  const viewers = item.getAttribute('data-viewers') || '0';

  if (!username || seenUsernames.has(username)) return; // skip duplicates or empty
  seenUsernames.add(username);

  let isKick = false;
  if (title.includes('🟢🟢Kick Stream☝️')) {
    title = title.replace('🟢🟢Kick Stream☝️', '').trim();
    isKick = true;
  }

  const streamID = isKick ? `${username}-k` : username;
  const showX = selectedStreams.includes(streamID);
  const viewerLabel = isKick ? `🟢Viewers: ${viewers}` : `🔴Viewers: ${viewers}`;

  gridHTML += `
    <div class="grid-item ${showX ? 'selected' : ''}" data-username="${username}" data-platform="${isKick ? 'kick' : 'twitch'}">
      <img src="${thumb}" alt="${title}">
      <h3>${username}</h3>
      <p>${title}</p>
      <span>${viewerLabel}</span>
      <button class="remove-x" style="display:${showX ? 'block' : 'none'};">X</button>
    </div>
  `;
});

  gridHTML += '</div>';
  document.getElementById('grid').innerHTML = gridHTML;

  // Bind add all and clear all
  document.getElementById('add-all-link').onclick = e => {
    e.preventDefault();
    matchingItems.forEach(item => {
      const usernameSpan = item.querySelector('.username');
      const username = usernameSpan ? usernameSpan.textContent.trim() : '';
      if (!username) return;

      const title = item.getAttribute('data-title') || '';
      const isKick = title.includes('🟢🟢Kick Stream☝️');
      const streamID = isKick ? `${username}-k` : username;

      if (!selectedStreams.includes(streamID)) {
        selectedStreams.push(streamID);
      }
    });
    updateMultiURL();
    highlightCategory(el); // Refresh grid UI
  };

  document.getElementById('clear-all-link').onclick = e => {
    e.preventDefault();
    selectedStreams = [];
    updateMultiURL();
    highlightCategory(el);
  };

  // Bind grid item click events
  bindGridItemEvents();
}

function updateMultiURL() {
  const base = 'https://multi.vaeb.io/';
  const urlParts = selectedStreams.map(name => name);
  const fullURL = base + urlParts.join('/');
  document.getElementById('multi-url').textContent = fullURL;

  // Show "Play USERNAME on this page" button if only one stream is selected
  let playButton = document.getElementById('play-single-btn');

  if (selectedStreams.length === 1) {
    const username = selectedStreams[0].replace(/-k$/, '').toUpperCase(); // Username in caps
    if (!playButton) {
      playButton = document.createElement('button');
      playButton.id = 'play-single-btn';
      playButton.style.marginLeft = '10px';
      document.getElementById('open-url').after(playButton);
    }
    playButton.textContent = `Play ${username} on this page`;
    playButton.style.display = 'inline-block';
    playButton.style.backgroundColor = '#ff0000'; // bright red
    playButton.style.color = '#ffffff';
    playButton.style.border = 'none';
    playButton.style.padding = '8px 16px';
    playButton.style.borderRadius = '6px';
    playButton.style.cursor = 'pointer';
playButton.onclick = () => {
  // Remove existing player
  let existingPlayer = document.getElementById('floating-player');
  if (existingPlayer) existingPlayer.remove();

  // Create floating player
  const playerDiv = document.createElement('div');
  playerDiv.id = 'floating-player';
  playerDiv.style.position = 'fixed';
  playerDiv.style.background = '#000';
  playerDiv.style.border = '2px solid #ff0000';
  playerDiv.style.borderRadius = '8px';
  playerDiv.style.zIndex = '9999';
  playerDiv.style.display = 'flex';
  playerDiv.style.flexDirection = 'column';
  playerDiv.style.cursor = 'default';
  playerDiv.style.transform = 'translate(0px,0px) scale(1)';
  let currentScale = 1;

  // Medium size: 70% viewport width
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const playerWidth = vw * 0.7;
  const playerHeight = playerWidth * 9 / 16; // keep 16:9 ratio

  playerDiv.style.width = playerWidth + 'px';
  playerDiv.style.height = playerHeight + 'px';
  playerDiv.style.top = `calc(50% - ${playerHeight / 2}px)`;
  playerDiv.style.left = `calc(50% - ${playerWidth / 2}px)`;
  playerDiv.style.right = 'auto';
  playerDiv.style.bottom = 'auto';

  // Controls
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.style.display = 'flex';
  controls.style.justifyContent = 'flex-end';
  controls.style.background = '#111';
  controls.style.padding = '4px';
  controls.style.borderBottom = '1px solid #444';
  controls.style.cursor = 'grab';

  const minimizeBtn = document.createElement('button');
  minimizeBtn.textContent = '−';
  const maximizeBtn = document.createElement('button');
  maximizeBtn.textContent = '⬜';
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';

  [minimizeBtn, maximizeBtn, closeBtn].forEach(btn => {
    btn.style.marginLeft = '4px';
    btn.style.background = '#ff0000';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '2px 6px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
  });

  controls.appendChild(minimizeBtn);
  controls.appendChild(maximizeBtn);
  controls.appendChild(closeBtn);
  playerDiv.appendChild(controls);

  // Video wrapper
  const videoWrapper = document.createElement('div');
  videoWrapper.style.flex = '1';
  videoWrapper.style.overflow = 'hidden';
  videoWrapper.style.position = 'relative';

  // Determine platform
  const selectedItem = document.querySelector('.grid-item.selected'); 
  const username = selectedItem.getAttribute('data-username');
  const platform = selectedItem.getAttribute('data-platform'); 
  const isKick = platform === 'kick';

  const src = isKick
    ? `https://player.kick.com/${username}?muted=false&autoplay=true`
    : `https://player.twitch.tv/?channel=${username}&parent=${window.location.hostname}&autoplay=true`;

  // Embed iframe
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.allow = 'autoplay; fullscreen';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  videoWrapper.appendChild(iframe);
  playerDiv.appendChild(videoWrapper);

  document.body.appendChild(playerDiv);

  // Drag from controls
  controls.addEventListener('mousedown', e => {
    e.preventDefault();
    controls.style.cursor = 'grabbing';
    let startX = e.clientX;
    let startY = e.clientY;

    const style = window.getComputedStyle(playerDiv);
    const matrix = new DOMMatrixReadOnly(style.transform);
    let offsetX = matrix.m41;
    let offsetY = matrix.m42;

    function onMouseMove(eMove) {
      const dx = eMove.clientX - startX;
      const dy = eMove.clientY - startY;
      playerDiv.style.transform = `translate(${offsetX + dx}px, ${offsetY + dy}px) scale(${currentScale})`;
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      controls.style.cursor = 'grab';
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

// Zoom on wheel
controls.addEventListener('wheel', e => {
  e.preventDefault();
  currentScale += e.deltaY * -0.0015; 
  currentScale = Math.min(Math.max(0.5, currentScale), 1.2); // max 1.2x
  const style = window.getComputedStyle(playerDiv);
  const matrix = new DOMMatrixReadOnly(style.transform);
  const offsetX = matrix.m41;
  const offsetY = matrix.m42;
  playerDiv.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentScale})`;
});

  // Minimize / Maximize / Close
  minimizeBtn.onclick = () => {
    playerDiv.style.transition = 'all 0.3s ease';
    playerDiv.style.width = '200px';
    playerDiv.style.height = '40px';
    playerDiv.style.top = '0px';
    playerDiv.style.left = 'calc(50% - 100px)';
    playerDiv.style.right = 'auto';
    playerDiv.style.bottom = 'auto';
    videoWrapper.style.display = 'none';
  };

  maximizeBtn.onclick = () => {
    playerDiv.style.transition = 'all 0.3s ease';
    playerDiv.style.width = playerWidth + 'px';
    playerDiv.style.height = playerHeight + 'px';
    playerDiv.style.top = `calc(50% - ${playerHeight / 2}px)`;
    playerDiv.style.left = `calc(50% - ${playerWidth / 2}px)`;
    videoWrapper.style.display = 'block';
  };

  closeBtn.onclick = () => playerDiv.remove();
};

  } else if (playButton) {
    playButton.style.display = 'none';
  }
}
document.getElementById('copy-url').addEventListener('click', function () {
  const url = document.getElementById('multi-url').textContent;
  navigator.clipboard.writeText(url).then(() => {
    const status = document.getElementById('copy-status');
    status.textContent = 'Copied!';
    setTimeout(() => {
      status.textContent = '';
    }, 1500);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
});

document.getElementById('open-url').addEventListener('click', () => {
  const url = document.getElementById('multi-url').textContent;
  window.open(url, '_blank');
});

function sortCategories() {
  const sidebar = document.getElementById('sidebar');
  const categories = Array.from(sidebar.querySelectorAll('.category'));

  categories.sort((a, b) => {
    const numA = parseInt(a.getAttribute('data-category').match(/^\d+/)[0]);
    const numB = parseInt(b.getAttribute('data-category').match(/^\d+/)[0]);
    return numA - numB;
  });

  categories.forEach(cat => {
    const original = cat.textContent.trim();
    const newLabel = original.replace(/^\d+/, '').trim();

    const categoryName = cat.getAttribute('data-category');
    const subItems = Array.from(sidebar.querySelectorAll(`.sub-item[data-category="${categoryName}"]`));
    const numberOfUsers = subItems.length;

    cat.innerHTML = `${newLabel} <span class="user-count">(${numberOfUsers})</span>`;

    sidebar.appendChild(cat);
    subItems.forEach(item => sidebar.appendChild(item));
  });
}

function clearGridItems() {
  const gridContainer = document.getElementById('grid');
  if (gridContainer) {
    gridContainer.innerHTML = ''; // removes all grid items
  }
}

function clearGridItems() {
  const gridContainer = document.getElementById('grid');
  if (gridContainer) {
    console.log('Clearing grid items...');
    gridContainer.innerHTML = ''; // clear grid content safely
  } else {
    console.log('No grid container found to clear.');
  }
}

function fetchAndUpdateSidebar() {
  fetch('https://raw.githubusercontent.com/gta-rp-playlist/gta-rp-playlist.github.io/refs/heads/main/data.txt')
    .then(r => {
      if (!r.ok) throw new Error('Failed to fetch sidebar data');
      return r.text();
    })
    .then(data => {
      lastFetchedData = data;

      const cleanedHTML = stripOnclickAttributes(data);
      document.getElementById('sidebar').innerHTML = cleanedHTML;

      preloadThumbnails();
      sortCategories();
      bindSidebarEvents();

      // Immediately clear and rebuild grid without delay
      clearGridItems();

      if (lastOpenedCategory) {
        const lastCat = document.querySelector(`.category[data-category="${lastOpenedCategory}"]`);
        if (lastCat) highlightCategory(lastCat);
        else {
          const firstCat = document.querySelector('#sidebar .category');
          if (firstCat) highlightCategory(firstCat);
        }
      } else {
        const firstCat = document.querySelector('#sidebar .category');
        if (firstCat) highlightCategory(firstCat);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

// Initial setup
fetchAndUpdateSidebar();
setInterval(fetchAndUpdateSidebar, 20000);
