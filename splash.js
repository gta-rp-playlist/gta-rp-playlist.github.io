// =======================
// Variables
// =======================
let lastFetchedData = '';
let lastOpenedCategory = null;
const selectedStreams = [];
const activeStreams = []; // [{ username, platform }]

// =======================
// Helper Functions
// =======================
function getUniqueSubItems(category) {
    const items = document.querySelectorAll(`.sub-item[data-category="${category}"]`);
    return Array.from(items).filter((item, index, arr) => {
        const username = item.querySelector('.username')?.textContent.trim().toLowerCase();
        return username && index === arr.findIndex(el => el.querySelector('.username')?.textContent.trim().toLowerCase() === username);
    });
}

function preloadAllThumbnails() {
    document.querySelectorAll('.sub-item[data-thumbnail]').forEach(el => {
        const url = el.getAttribute('data-thumbnail');
        if (url) {
            const img = new Image();
            img.src = url;
        }
    });
}

function parseViewers(el) {
    const text = el.querySelector('.viewer-count')?.textContent || "";
    const numbers = text.match(/\d+/g);
    return numbers ? numbers.map(Number).reduce((a,b) => a + b, 0) : 0;
}

// =======================
// DOM Update / Highlight Functions
// =======================
function highlightClickedUsername(username) {
    const subItem = Array.from(document.querySelectorAll('.sub-item'))
        .find(el => el.querySelector('.username')?.textContent.trim().toLowerCase() === username);
    if (!subItem) return;
    if (selectedStreams.includes(username)) {
        subItem.classList.add('highlighted-sub-item');
    } else {
        subItem.classList.remove('highlighted-sub-item');
    }
}

function updateCategoryHighlights() {
    document.querySelectorAll('.category').forEach(catEl => {
        const category = catEl.getAttribute('data-category');
        const hasSelected = selectedStreams.some(username => {
            const subItem = Array.from(document.querySelectorAll('.sub-item'))
                .find(el => el.getAttribute('data-category') === category &&
                            el.querySelector('.username')?.textContent.trim().toLowerCase() === username );
            return !!subItem;
        });
        catEl.classList.toggle('active', hasSelected);
    });
}

function highlightCategory(categoryEl) {
    if (!categoryEl) return;
    document.querySelectorAll('.category').forEach(cat => cat.classList.remove('expanded'));
    categoryEl.classList.add('expanded');

    const category = categoryEl.getAttribute('data-category');
    lastOpenedCategory = category;
    localStorage.setItem('lastOpenedCategory', category);

    const matchingItems = Array.from(document.querySelectorAll('.sub-item'))
        .filter(item => item.getAttribute('data-category') === category)
        .sort((a, b) => extractTotalViewerCountFromSubItem(b) - extractTotalViewerCountFromSubItem(a));

    const seenUsernames = new Set();
    const timestamp = Date.now();
    let gridHTML = `<div class="grid">`;

    matchingItems.forEach(item => {
        const usernameSpan = item.querySelector('.username');
        const username = usernameSpan ? usernameSpan.textContent.trim() : '';
        if (!username || seenUsernames.has(username)) return;
        seenUsernames.add(username);

        const title = item.getAttribute('data-title') || '';
        const thumb = item.getAttribute('data-thumbnail') ? item.getAttribute('data-thumbnail') + '?cb=' + timestamp : '';
        const viewers = extractTotalViewerCountFromSubItem(item);
        const isKick = title.includes('🟢🟢Kick Stream☝️');
        const displayTitle = isKick ? title.replace('🟢🟢Kick Stream☝️','').trim() : title;
        const isSelected = selectedStreams.includes(username);
        const viewerLabel = isKick ? `🟢Viewers: ${viewers}` : `🔴Viewers: ${viewers}`;

        gridHTML += `<div class="grid-item ${isSelected ? 'selected-red-outline' : ''}" data-username="${username}" data-platform="${isKick ? 'kick':'twitch'}">
            <img src="${thumb}" alt="${displayTitle}">
            <div class="grid-item-content">
                <h3>${username}</h3>
                <p>${displayTitle}</p>
                <span>${viewerLabel}</span>
            </div>
        </div>`;
    });

    gridHTML += '</div>';
    const gridElement = document.getElementById('grid');
    if (gridElement) {
        gridElement.innerHTML = gridHTML;
        gridElement.querySelectorAll('.grid-item').forEach(item => {
            item.addEventListener('click', () => {
                const username = item.dataset.username;
                const platform = item.dataset.platform;
                playStream(username, platform);
            });
        });
    }

    updateSelectedButtonVisibility();
    updateCategoryHighlights();
}

function collapseAllSubItems() {
    document.querySelectorAll('.sub-item[data-category]').forEach(el => el.style.display = 'none');
}

function updateSidebarCategoryCount(category) {
    const subItems = getUniqueSubItems(category);
    const totalViewers = subItems.reduce((sum, el) => sum + parseViewers(el), 0);
    const catEl = document.querySelector(`.category[data-category="${category}"]`);
    if (catEl) {
        const title = catEl.textContent.split(' (')[0];
        catEl.innerHTML = `${title} <span class="user-count">(${subItems.length})</span> <span class="total_viewers_group"><span class="emoji-eye">👁️</span>${totalViewers.toLocaleString()}</span>`;
    }
}

// =======================
// Sorting Functions
// =======================
function sortCategories() {
    const sidebar = document.getElementById('sidebar');
    const categories = Array.from(sidebar.getElementsByClassName('category'));

    categories.sort((a, b) => {
        const numA = parseInt(a.textContent.match(/^\d+/)) || 0;
        const numB = parseInt(b.textContent.match(/^\d+/)) || 0;
        if (numA === numB) {
            const nameA = a.textContent.replace(/^\d+/, '').trim();
            const nameB = b.textContent.replace(/^\d+/, '').trim();
            return nameA.localeCompare(nameB);
        }
        return numA - numB;
    });

    categories.forEach(category => {
        sidebar.appendChild(category);
        const subItems = getUniqueSubItems(category.dataset.category)
            .sort((a, b) => parseInt(b.dataset.viewers.replace(/,/g,'')) - parseInt(a.dataset.viewers.replace(/,/g,'')));
        subItems.forEach(subItem => sidebar.appendChild(subItem));
    });

    categories.forEach(cat => cat.textContent = cat.textContent.replace(/^\d+/, '').trim());
}

// =======================
// Core Actions
// =======================
function toggleSubItems(category) {
    if (!category) return;
    const subItems = getUniqueSubItems(category);
    if (!subItems.length) return;
    const isExpanded = subItems[0].style.display === 'block';

    document.querySelectorAll('.sub-item[data-category]').forEach(el => {
        if (el.getAttribute('data-category') !== category) el.style.display = 'none';
    });

    subItems.forEach(el => el.style.display = isExpanded ? 'none' : 'block');

    if (!isExpanded) {
        lastOpenedCategory = category;
        updateSidebarCategoryCount(category);
    }

    selectedStreams.forEach(username => highlightClickedUsername(username));
    updateCategoryHighlights();
}

function playStream(username, platform) {
    // Redirect to the specific page
    const url = `https://gta-rp-playlist.com/nopixel.html?user=${encodeURIComponent(username)}`;
    window.location.href = url;
}

function updateSelectedButtonVisibility() {
    const container = document.getElementById('selected-button-container');
    if (!container) return;
    container.style.display = selectedStreams.length > 0 ? 'block' : 'none';
}

function fetchAndUpdateSidebar() {
    fetch('https://raw.githubusercontent.com/gta-rp-playlist/gta-rp-playlist.github.io/refs/heads/main/data.txt')
        .then(r => { if (!r.ok) throw new Error(); return r.text(); })
        .then(data => {
            lastFetchedData = data;
            const sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = data;

            sortCategories();
            document.querySelectorAll('.category').forEach(cat => updateSidebarCategoryCount(cat.dataset.category));
            collapseAllSubItems();
            preloadAllThumbnails();

            // Restore the last opened category after refresh
            if (lastOpenedCategory) {
                const lastCatEl = document.querySelector(`.category[data-category="${lastOpenedCategory}"]`);
                if (lastCatEl) {
                    toggleSubItems(lastOpenedCategory);
                    highlightCategory(lastCatEl);
                }
            }

            // Refresh thumbnails
            const timestamp = Date.now();
            document.querySelectorAll('.grid-item img').forEach(img => {
                const oldSrc = img.getAttribute("data-original") || img.src;
                const cleanSrc = oldSrc.split("?cb=")[0];
                img.setAttribute("data-original", cleanSrc);
                img.src = `${cleanSrc}?cb=${timestamp}`;
            });

            // Restore selected highlights
            selectedStreams.forEach(username => {
                highlightClickedUsername(username);
                const gridItem = document.querySelector(`.grid-item[data-username="${username}"]`);
                if (gridItem) gridItem.classList.add("selected-red-outline");
            });

            updateCategoryHighlights();
            updateSelectedButtonVisibility();
        })
        .catch(() => {});
}


window.onload = () => {
    fetchAndUpdateSidebar();
    setInterval(fetchAndUpdateSidebar, 90000);
};

// =======================
// Event Listeners
// =======================
document.getElementById('sidebar').addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('category')) {
        toggleSubItems(target.dataset.category);
        highlightCategory(target);
        return;
    }

    const subItem = target.closest('.sub-item');
    if (!subItem) return;
    const usernameSpan = subItem.querySelector('.username');
    if (!usernameSpan) return;
    const username = usernameSpan.textContent.trim().toLowerCase();
    highlightClickedUsername(username);
});

const sidebar = document.getElementById('sidebar');
const grid = document.getElementById('grid-container');

function toggleSidebar() {
    sidebar.classList.toggle('hidden');
    grid.classList.toggle('full-width');
}

function extractTotalViewerCountFromSubItem(item) {
    const viewerSpan = item.querySelector('.viewer-count');
    if (!viewerSpan) return 0;
    const text = viewerSpan.textContent;
    const greenMatch = text.match(/🟢(\d+)/g) || [];
    const redMatch = text.match(/🔴(\d+)/g) || [];
    const greenSum = greenMatch.reduce((sum, str) => sum + (parseInt(str.replace('🟢',''),10)||0), 0);
    const redSum = redMatch.reduce((sum, str) => sum + (parseInt(str.replace('🔴',''),10)||0), 0);
    return greenSum + redSum;
}
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const actionBar = document.getElementById("grid-action-container");

    // Always show sidebar
    if (sidebar) sidebar.classList.remove("hidden");
    if (actionBar) actionBar.classList.remove("sidebar-hidden");
    document.body.classList.remove("sidebar-hidden");
});
