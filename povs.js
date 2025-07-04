let selectedStreams = [];
let lastFetchedData = '';
let lastOpenedCategory = '';

function highlightCategory(el) {
  document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
  el.classList.add('active');

  const category = el.getAttribute('data-category');
  lastOpenedCategory = category;

  let matchingItems = Array.from(document.querySelectorAll('.sub-item'))
    .filter(item => item.getAttribute('data-category') === category);

  matchingItems.sort((a, b) => {
    const viewersA = parseInt(a.getAttribute('data-viewers'));
    const viewersB = parseInt(b.getAttribute('data-viewers'));
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

// ✅ Track usernames seen
const seenUsernames = new Set();

matchingItems.forEach(item => {
  let title = item.getAttribute('data-title');
  const thumb = item.getAttribute('data-thumbnail');
  const username = item.querySelector('.username').textContent.trim();
  const viewers = item.getAttribute('data-viewers');

  if (seenUsernames.has(username)) return; // Skip duplicate
  seenUsernames.add(username);

  let isKick = false;
  if (title.includes('🟢🟢Kick Stream☝️')) {
    title = title.replace('🟢🟢Kick Stream☝️', '').trim();
    isKick = true;
  }

  const streamID = isKick ? `${username}-k` : username;
  const showX = selectedStreams.includes(streamID);

  gridHTML += `
    <div class="grid-item" data-username="${username}" data-platform="${isKick ? 'kick' : 'twitch'}">
      <img src="${thumb}" alt="${title}">
      <h3>${username}</h3>
      <p>${title}</p>
      <span>${viewers} watching</span>
      <button class="remove-x" style="display:${showX ? 'block' : 'none'};">X</button>
    </div>
  `;
});

gridHTML += '</div>';
  document.getElementById('grid').innerHTML = gridHTML;

  document.getElementById('add-all-link').addEventListener('click', e => {
    e.preventDefault();
    matchingItems.forEach(item => {
      const username = item.querySelector('.username').textContent;
      const title = item.getAttribute('data-title');
      const isKick = title.includes('🟢🟢Kick Stream☝️');
      const streamID = isKick ? `${username}-k` : username;
      if (!selectedStreams.includes(streamID)) {
        selectedStreams.push(streamID);
      }
    });
    updateMultiURL();
    highlightCategory(el);
  });

  document.getElementById('clear-all-link').addEventListener('click', e => {
    e.preventDefault();
    selectedStreams = [];
    updateMultiURL();
    highlightCategory(el);
  });

  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.classList.contains('remove-x')) return;

      const username = item.getAttribute('data-username');
      const platform = item.getAttribute('data-platform');
      const streamID = platform === 'kick' ? `${username}-k` : username;

      if (!selectedStreams.includes(streamID)) {
        selectedStreams.push(streamID);
        item.querySelector('.remove-x').style.display = 'block';
        updateMultiURL();
      }
    });

    item.querySelector('.remove-x').addEventListener('click', e => {
      e.stopPropagation();
      const username = item.getAttribute('data-username');
      const platform = item.getAttribute('data-platform');
      const streamID = platform === 'kick' ? `${username}-k` : username;

      selectedStreams = selectedStreams.filter(s => s !== streamID);
      item.querySelector('.remove-x').style.display = 'none';
      updateMultiURL();
    });
  });
}

function updateMultiURL() {
  const base = 'https://multi.vaeb.io/';
  const urlParts = selectedStreams.map(name => `<span class="stream">${name}</span>`);
  const fullHTML = base + urlParts.join('/');
  document.getElementById('multi-url').innerHTML = fullHTML;
}

document.getElementById('copy-url').addEventListener('click', () => {
  const url = document.getElementById('multi-url').textContent;
  navigator.clipboard.writeText(url).then(() => alert('Copied!'));
});

document.getElementById('open-url').addEventListener('click', () => {
  window.open(document.getElementById('multi-url').textContent, '_blank');
});

// Hide all sub-items initially
document.querySelectorAll('.sub-item').forEach(item => {
  item.style.display = 'none';
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

function fetchAndUpdateSidebar_none() {
  fetch('https://raw.githubusercontent.com/gta-rp-playlist/gta-rp-playlist.github.io/refs/heads/main/data.txt')
    .then(r => {
      if (!r.ok) throw new Error();
      return r.text();
    })
    .then(data => {
      if (data !== lastFetchedData) {
        lastFetchedData = data;
        document.getElementById('sidebar').innerHTML = data;
        sortCategories();
        if (lastOpenedCategory) {
          highlightCategory(document.querySelector(`.category[data-category="${lastOpenedCategory}"]`));
        }
      }
    })
    .catch(() => {});
}

sortCategories();
setInterval(fetchAndUpdateSidebar_none, 60000);
