let lastFetchedData = null;
let lastOpenedCategory = null;
const thumbnailIntervals = new Map();

function updateSidebarCategoryCount(category) {
  const sidebar = document.getElementById('sidebar');
  const subItems = sidebar.querySelectorAll(`.sub-item[data-category="${category}"]`);
  const count = subItems.length;
  const categoryElement = sidebar.querySelector(`.category[data-category="${category}"]`);
  if (categoryElement) {
    const label = categoryElement.textContent.replace(/\(\d+\)/, '').trim();
    categoryElement.innerHTML = `${label} <span class="user-count">(${count})</span>`;
  }
}

function refreshThumbnail(imgElement, baseUrl) {
  const container = imgElement.parentElement;

  function updateImage() {
    // Remove old <img>
    if (imgElement.parentElement) {
      container.removeChild(imgElement);
    }

    // Create new <img>
    const newImg = document.createElement('img');
    newImg.className = 'thumbnail';
    newImg.style.maxWidth = '100%';
    newImg.style.borderRadius = '4px';
    newImg.style.display = 'block';
    newImg.style.marginTop = '6px';

    // Set src after short delay with cache buster
    setTimeout(() => {
      const timestamp = Date.now();
      newImg.src = `${baseUrl}?cb=${timestamp}`;
    }, 50);

    // Append new <img>
    container.appendChild(newImg);

    // Update imgElement reference for next cycle
    imgElement = newImg;
  }

  updateImage();

  // Clear any previous interval for old imgElement to prevent duplicates
  if (thumbnailIntervals.has(imgElement)) {
    clearInterval(thumbnailIntervals.get(imgElement));
  }

  const intervalId = setInterval(updateImage, 10000);
  thumbnailIntervals.set(imgElement, intervalId);
}

function fetchAndUpdateSidebar_none() {
  fetch('https://raw.githubusercontent.com/gta-rp-playlist/gta-rp-playlist.github.io/refs/heads/main/data.txt')
    .then(r => {
      if (!r.ok) throw new Error('Network response not ok');
      return r.text();
    })
    .then(data => {
      if (data !== lastFetchedData) {
        lastFetchedData = data;
        const sidebar = document.getElementById('sidebar');

        // Clear all thumbnail intervals before replacing HTML
        thumbnailIntervals.forEach(intervalId => clearInterval(intervalId));
        thumbnailIntervals.clear();

        sidebar.innerHTML = data;

        sidebar.querySelectorAll('.sub-item').forEach(item => {
          const thumb = item.getAttribute('data-thumbnail');
          if (!thumb) return;

          let img = item.querySelector('img.thumbnail');
          if (!img) {
            img = document.createElement('img');
            img.className = 'thumbnail';
            img.style.maxWidth = '100%';
            img.style.borderRadius = '4px';
            img.style.display = 'block';
            img.style.marginTop = '6px';
            item.appendChild(img);
          }

          refreshThumbnail(img, thumb);
        });

        sortCategories();

        document.querySelectorAll('.category').forEach(e => {
          updateSidebarCategoryCount(e.dataset.category);
        });

        if (lastOpenedCategory) toggleSubItems(lastOpenedCategory);
      }
    })
    .catch(() => {});
}

fetchAndUpdateSidebar_none();
setInterval(fetchAndUpdateSidebar_none, 20000);
