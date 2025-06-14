// this filename is start_1.js

function sortCategories() {
    var sidebar = document.getElementById('sidebar');
    var categories = Array.from(sidebar.getElementsByClassName('category'));
    categories.sort(function(a, b) {
        var numA = parseInt(a.textContent.match(/^\d+/)) || 0;
        var numB = parseInt(b.textContent.match(/^\d+/)) || 0;
        if (numA === numB) {
            var nameA = a.textContent.replace(/^\d+/, '').trim();
            var nameB = b.textContent.replace(/^\d+/, '').trim();
            return nameA.localeCompare(nameB);
        }
        return numA - numB;
    });
    categories.forEach(function(category) {
        sidebar.appendChild(category);
        var subItems = document.querySelectorAll('.sub-item[data-category="' + category.dataset.category + '"]');
        var sortedSubItems = Array.from(subItems).sort(function(a, b) {
            var viewersA = parseInt(a.dataset.viewers.replace(/,/g, '')) || 0;
            var viewersB = parseInt(b.dataset.viewers.replace(/,/g, '')) || 0;
            return viewersB - viewersA;
        });
        sortedSubItems.forEach(function(subItem) {
            sidebar.appendChild(subItem);
        });
    });
    categories.forEach(function(category) {
        category.textContent = category.textContent.replace(/^\d+/, '').trim();
    });
}

function highlightClickedUsername(streamName) {
    document.querySelectorAll('.sub-item').forEach(function(el) {
        el.classList.remove('highlighted-sub-item');
    });
    var subItemElement = Array.from(document.querySelectorAll('.sub-item')).find(function(el) {
        return el.querySelector('.username').textContent.trim().toLowerCase() === streamName;
    });
    if (subItemElement) subItemElement.classList.add('highlighted-sub-item');
    var usernameDivs = document.querySelectorAll('#usernamesList > div');
    usernameDivs.forEach(function(div) {
        div.classList.remove('highlighted-title-div');
    });
    var targetDiv = Array.from(usernameDivs).find(function(div) {
        return div.querySelector('.username-bubble').textContent.trim().toLowerCase() === streamName;
    });
    if (targetDiv) targetDiv.classList.add('highlighted-title-div');
}

function collapseAllSubItems() {
    document.querySelectorAll('.sub-item[data-category]').forEach(function(el) {
        el.style.display = 'none';
    });
}

function updateSidebarCategoryCount(category) {
    const subItems = document.querySelectorAll('.sub-item[data-category="' + category + '"]');
    const unique = Array.from(subItems).filter(function(item, i, arr) {
        const name = item.querySelector('.username').textContent.trim().toLowerCase();
        return i === arr.findIndex(el => el.querySelector('.username').textContent.trim().toLowerCase() === name);
    });
    const catEl = document.querySelector(`.category[data-category="${category}"]`);
    if (catEl) {
        const title = catEl.textContent.split(' (')[0];
        catEl.innerHTML = `${title} <span class="user-count">(${unique.length})</span>`;
    }
}

function highlightCategory(category) {
    var categories = document.getElementsByClassName('category');
    for (var i = 0; i < categories.length; i++) {
        categories[i].classList.remove('highlighted');
    }
    category.classList.add('highlighted');
}

function fetchAndUpdateSidebar() {
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
                const params = new URLSearchParams(window.location.search);
                const user = params.get('user');
                if (user) {
                    const userCat = findUserCategory(user);
                    if (userCat) {
                        toggleSubItems(userCat);
                        highlightCategory(document.querySelector(`.category[data-category="${userCat}"]`));
                        playStream(user);
                    }
                } else {
                    const hash = window.location.hash;
                    if (hash) {
                        const mapped = categoryMappings[hash.substring(1).toLowerCase()];
                        if (mapped) {
                            toggleSubItems(mapped);
                            highlightCategory(document.querySelector(`.category[data-category="${mapped}"]`));
                            const name = document.querySelector(`.sub-item[data-category="${mapped}"] .username`).textContent.trim().toLowerCase();
                            playStream(name);
                        }
                    } else {
                        const first = document.querySelector('.category');
                        if (first) {
                            toggleSubItems(first.dataset.category);
                            highlightCategory(first);
                            const name = document.querySelector(`.sub-item[data-category="${first.dataset.category}"] .username`).textContent.trim().toLowerCase();
                            playStream(name);
                        }
                    }
                }
                document.querySelectorAll('.category').forEach(e => {
                    updateSidebarCategoryCount(e.dataset.category);
                });
            }
        })
        .catch(() => {});
}

function findUserCategory(username) {
    const items = document.querySelectorAll('.sub-item');
    for (let item of items) {
        const user = item.querySelector('.username');
        if (user && user.textContent.trim().toLowerCase() === username.toLowerCase()) {
            return item.dataset.category;
        }
    }
    return null;
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
                collapseAllSubItems();
                sortCategories();
                document.querySelectorAll('.category').forEach(e => {
                    updateSidebarCategoryCount(e.dataset.category);
                });
                if (lastOpenedCategory) toggleSubItems(lastOpenedCategory);
            }
        })
        .catch(() => {});
}

function fetchAndUpdateNumbers() {
    fetch('https://raw.githubusercontent.com/gta-rp-playlist/gta-rp-playlist.github.io/refs/heads/main/numbers.txt')
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(data => {
            document.getElementById('streamdata').innerHTML = data;
        })
        .catch(() => {});
}

function fetchAndUpdateSidebar_2() {
    fetch('data2.txt')
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(data => {
            if (data !== lastFetchedData_2) {
                lastFetchedData_2 = data;
                document.getElementById('sidebar').innerHTML = data;
                sortCategories();
                var first = document.querySelector('.category');
                if (first) {
                    lastOpenedCategory_2 = first.dataset.category;
                    toggleSubItems(first.dataset.category);
                    var name = document.querySelector('.sub-item[data-category="' + first.dataset.category + '"] .username').textContent.trim().toLowerCase();
                    playStream(name);
                }
                document.querySelectorAll('.category').forEach(e => {
                    updateSidebarCategoryCount(e.dataset.category);
                });
            }
        })
        .catch(() => {});
}

function fetchAndUpdateSidebar_2_none() {
    fetch('data2.txt')
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(data => {
            if (data !== lastFetchedData_2) {
                lastFetchedData_2 = data;
                document.getElementById('sidebar').innerHTML = data;
                collapseAllSubItems();
                sortCategories();
                document.querySelectorAll('.category').forEach(e => {
                    updateSidebarCategoryCount(e.dataset.category);
                });
                if (lastOpenedCategory_2) toggleSubItems(lastOpenedCategory_2);
            }
        })
        .catch(() => {});
}

function fetchAndUpdateNumbers_2() {
    fetch('numbers2.txt')
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(data => {
            document.getElementById('streamdata').innerHTML = data;
        })
        .catch(() => {});
}
