// this filename is start_2.js

function toggleSubItems(category) {
    var categoryName = category.replace(/^\d+/, '');
    var subItems = document.querySelectorAll('.sub-item[data-category]');
    var clickedSubItems = document.querySelectorAll('.sub-item[data-category="' + category + '"]');
    var isExpanded = clickedSubItems[0].style.display === 'block';
    collapseAllSubItems();

    if (!isExpanded) {
        var uniqueSubItems = Array.from(clickedSubItems).filter(function(subItem, index, self) {
            var username = subItem.querySelector('.username').textContent.trim().toLowerCase();
            return index === self.findIndex(function(s) {
                return s.querySelector('.username').textContent.trim().toLowerCase() === username;
            });
        });

        uniqueSubItems.forEach(function(subItem) {
            subItem.style.display = 'block';
        });

        lastOpenedCategory = category;

        var sortedSubItems = uniqueSubItems.sort(function(a, b) {
            var viewersA = parseInt(a.dataset.viewers.replace(/,/g, '')) || 0;
            var viewersB = parseInt(b.dataset.viewers.replace(/,/g, '')) || 0;
            return viewersB - viewersA;
        });

        var usernamesList = document.getElementById('usernamesList');
        var groupTitle = document.createElement('h3');
        groupTitle.textContent = categoryName.trim();
        groupTitle.style.fontSize = '27px';
        groupTitle.style.color = 'white';
        usernamesList.innerHTML = '';
        usernamesList.appendChild(groupTitle);

        sortedSubItems.forEach(function(subItem) {
            var usernameContainer = document.createElement('div');
            var streamName = subItem.querySelector('.username').textContent.trim().toLowerCase();
            var username = document.createElement('span');
            var title = document.createElement('span');
            var viewerCount = document.createElement('span');

            username.textContent = subItem.querySelector('.username').textContent.trim();
            var streamTitle = subItem.getAttribute('data-title') || '';
            var displayTitle = streamTitle.replace(/🟢🟢Kick Stream☝️/g, '').trim();
            title.textContent = ' - ' + displayTitle;

            var isKickStream = streamTitle.includes("🟢🟢Kick Stream☝️");

            viewerCount.textContent = (isKickStream ? '🟢' : '🔴') + subItem.getAttribute('data-viewers');

            usernameContainer.appendChild(viewerCount);
            usernameContainer.appendChild(username);
            usernameContainer.appendChild(title);

            username.style.cursor = 'pointer';
            username.style.fontSize = '20px';
            username.style.color = 'purple';
            username.classList.add('username-bubble');

            title.style.fontSize = '18px';
            title.style.color = 'white';

            viewerCount.style.fontSize = '12px';
            viewerCount.style.color = 'white';
            viewerCount.style.position = 'relative';
            viewerCount.style.top = '-11px';
            viewerCount.style.paddingRight = '10px';

            username.addEventListener('click', function() {
                playStream(streamName);
            });

            usernamesList.appendChild(usernameContainer);
        });

        var numberOfUsers = uniqueSubItems.length;
        var currentPage = window.location.pathname.split('/').pop();
        var server = currentPage === 'prodigy.html' ? 'prodigy' : 'nopixel';

        var url = `filter.html?server=${server}&category=${encodeURIComponent(categoryName.trim())}&limitstreams=25`;
        if (numberOfUsers <= 6) {
            url += '&quality=chunked';
        } else if (numberOfUsers <= 12) {
            url += '&quality=medium';
        } else {
            url += '&quality=low';
        }

        groupTitle.innerHTML = `${categoryName.trim()} <span class="user-count">(${numberOfUsers})</span> <span class="grid-link">[view all]</span>`;

        document.querySelector('.grid-link').addEventListener('click', function() {
            window.location.href = url;
        });

        const sidebarCategory = document.querySelector(`.category[data-category="${category}"]`);
        document.querySelectorAll('.view-all-link').forEach(el => el.remove());

        if (sidebarCategory) {
            const currentSidebarTitle = sidebarCategory.textContent.split(' (')[0];
            sidebarCategory.innerHTML = `
                ${currentSidebarTitle} 
                <span class="user-count">(${numberOfUsers})</span> 
                <sup class="view-all-link">View All</sup>
            `;

            const viewAllLink = sidebarCategory.querySelector('.view-all-link');
            if (viewAllLink) {
                viewAllLink.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.href = url;
                });
            }
        }
    }
}

document.getElementById('sidebar').addEventListener('click', function(event) {
    var target = event.target;

    if (target.classList.contains('category')) {
        toggleSubItems(target.dataset.category);
        if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        const url = new URL(window.location.href);
        url.searchParams.delete('user');
        history.replaceState(null, '', url);
    }

    if (target.classList.contains('username')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('user');
        history.replaceState(null, '', url);
    }
});
