// Mapping of lowercase category names to their respective values
const categoryMappings = {
    'cops': '01Cops',  
    'lspd': '02LSPD',
    'bcso': '03BCSO',
    'marshalls': '04Marshalls',  
    'government': '06Government',  
    'doctors': '07Doctors',  
    'ncypress': '09NCypress',  
    'nourf': '09NCypress',  
    'scypress': '09SCypress',  
    's_cypress': '09SCypress',  
    'besties': '10Besties',  
    'hydra': '11Hydra',  
    'hades': '12Hades',  
    'manor': '14Manor',  
    'admc': '15ADMC',  
    'chaoslegion': '16ChaosLegion',  
    'clowns': '17Clowns',  
    'saints': '18Saints',  
    'fnf': '19FnF',  
    'fatf': '19FnF',  
    'f&f': '19FnF',  
    'tripas': '20Tripas',  
    'gblock': '21GBlock',  
    'epsilon': '24Epsilon', 
    'raidersmc': '24RaidersMC',  
    'crackheads': '27Crackheads',  
    'halo': '29Halo',  
    'kaneshiro': '25Kaneshiro',  
    'neontigers': '26NeonTigers',  
    'ktb': '28KTB',  
    'ballas': '28Ballas',  
    'lostmc': '29LostMC',  
    'faceless': '30Faceless',  
    '⸸bd': '31⸸BD',  
    'vagos': '32Vagos',  
    'mimes': '40Mimes',  
    'civgang': '33CivGang',  
    'italians': '34Italians',  
    'cg': '36CG',  
    'cg_2': '37CG_2',  
    'theproject': '38TheProject',  
    'project': '38TheProject',  
    'guild': '39Guild',  
    'angels': '40Angels',  
    'oldcops': '41OldCops',  
    'lumberjacks': '42LumberJacks',  
    'wsmc': '43WSMC',  
    'blacklotus': '44BlackLotus',  
    'hoa': '45HOA',  
    'doc': '41DOC',  
    'lifers': '42Lifers',  
    'tsl': '46TSL',  
    'bbmc': '47BBMC',  
    'hiddenmc': '48HiddenMC',  
    'c4': '49C4',  
    'streetbratz': '50StreetBratz',  
    'diamonddogs': '51DiamondDogs',  
    'mayhemmc': '52MayhemMC',  
    'mayhem': '52MayhemMC',  
    'baddies': '53Baddies',  
    'guerilla': '54Guerrilla',  
    'guerrilla': '54Guerrilla',  
    'devs': '55Devs',  
    'survival': '56Survival',  
    'independent': '57Independent',  
    'uncategorized': '58Uncategorized'
  };
  
  // Function to fetch and update the sidebar
  function fetchAndUpdateSidebar() {
    fetch('data.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();  // Read the response as plain text
      })
      .then(data => {
        if (data !== lastFetchedData) {
          lastFetchedData = data;
  
          // Insert the fetched data into the sidebar
          document.getElementById('sidebar').innerHTML = data;
  
          // Run the sidebar formatting and initialization code after the data is loaded
          sortCategories();
  
          // Check if the URL contains a category hash or user parameter
          const urlParams = new URLSearchParams(window.location.search);
          const userFromParams = urlParams.get('user'); // Get the user parameter
  
          if (userFromParams) {
            // Find the category of the user
            const userCategory = findUserCategory(userFromParams);
  
            if (userCategory) {
              // Open the category and play the user's stream
              toggleSubItems(userCategory);
              const categoryElement = document.querySelector(`.category[data-category="${userCategory}"]`);
              highlightCategory(categoryElement);
              playStream(userFromParams);
            } else {
              console.warn(`User ${userFromParams} not found in any category.`);
            }
          } else {
            // Check for category hash in the URL
            const hash = window.location.hash; // Get the current hash
            if (hash) {
              // Extract the category from the hash
              const categoryFromHash = hash.substring(1).toLowerCase(); // Remove the '#' and convert to lowercase
              const categoryCode = categoryMappings[categoryFromHash];
  
              if (categoryCode) {
                const categoryElement = document.querySelector(`.category[data-category="${categoryCode}"]`);
                toggleSubItems(categoryCode);
                highlightCategory(categoryElement);
                const firstStreamName = document.querySelector(`.sub-item[data-category="${categoryCode}"] .username`).textContent.trim().toLowerCase();
                playStream(firstStreamName);
              } else {
                console.warn(`Category ${categoryFromHash} not found in the mappings.`);
              }
            } else {
              // If no category in the hash, get the first category and expand it
              const firstCategory = document.querySelector('.category');
              if (firstCategory) {
                toggleSubItems(firstCategory.dataset.category);
                highlightCategory(firstCategory);
                const firstStreamName = document.querySelector('.sub-item[data-category="' + firstCategory.dataset.category + '"] .username').textContent.trim().toLowerCase();
                playStream(firstStreamName);
              }
            }
          }
  
          // Update all category titles in the sidebar with user counts
          document.querySelectorAll('.category').forEach(categoryElement => {
            updateSidebarCategoryCount(categoryElement.dataset.category);
          });
  
          console.log("Sidebar updated with new data");
        } else {
          console.log("No changes detected in data.txt");
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  
  // Helper function to find the category of a user
  function findUserCategory(username) {
    const categories = document.querySelectorAll('.sub-item'); // Select all sub-items
    for (let subItem of categories) {
      const userElement = subItem.querySelector('.username');
      if (userElement && userElement.textContent.trim().toLowerCase() === username.toLowerCase()) {
        return subItem.dataset.category; // Return the category of the found user
      }
    }
    return null; // Return null if user is not found
  }
    
    function fetchAndUpdateSidebar_none() {
        fetch('data.txt')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text();  // Read the response as plain text
          })
          .then(data => {
            if (data !== lastFetchedData) {
              // Only update if the data has changed
              lastFetchedData = data;
    
              // Insert the fetched data into the sidebar
              document.getElementById('sidebar').innerHTML = data;
    
              // Run the sidebar formatting and initialization code after the data is loaded
              collapseAllSubItems();
              sortCategories(); // Ensure categories are sorted first
    
              // Update all category titles in the sidebar with user counts
              document.querySelectorAll('.category').forEach(categoryElement => {
                  updateSidebarCategoryCount(categoryElement.dataset.category);
              });
    
              // Re-expand the last opened category if it exists
              if (lastOpenedCategory) {
                  toggleSubItems(lastOpenedCategory);
              }
    
              console.log("Sidebar updated with new data");
            } else {
              console.log("No changes detected in data.txt");
            }
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
    }
  // Function to fetch and update numbers
  function fetchAndUpdateNumbers() {
      fetch('numbers.txt')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.text(); // Read the response as plain text
          })
          .then(data => {
              // Insert the fetched data into the streamdata div
              document.getElementById('streamdata').innerHTML = data;
              console.log("Stream data updated with new numbers");
          })
          .catch(error => {
              console.error('There was a problem with the fetch operation for numbers:', error);
          });
  }
  
  
  
  // Function to fetch and update the sidebar
  function fetchAndUpdateSidebar_2() {
      fetch('data2.txt')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();  // Read the response as plain text
        })
        .then(data => {
          if (data !== lastFetchedData_2) {
            // Only update if the data has changed
            lastFetchedData_2 = data;
    
            // Insert the fetched data into the sidebar
            document.getElementById('sidebar').innerHTML = data;
    
            // Run the sidebar formatting and initialization code after the data is loaded
            sortCategories();
    
            // Get the first category and expand it
            var firstCategory = document.querySelector('.category');
            if (firstCategory) {
                lastOpenedCategory_2 = firstCategory.dataset.category; // Store the opened category
                toggleSubItems(firstCategory.dataset.category);
    
                // Get the first user in the expanded first category and play the stream
                var firstStreamName = document.querySelector('.sub-item[data-category="' + firstCategory.dataset.category + '"] .username').textContent.trim().toLowerCase();
                playStream(firstStreamName);
            }
    
            // Update all category titles in the sidebar with user counts
            document.querySelectorAll('.category').forEach(categoryElement => {
                updateSidebarCategoryCount(categoryElement.dataset.category);
            });
    
            console.log("Sidebar updated with new data");
          } else {
            console.log("No changes detected in data.txt");
          }
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
    
    function fetchAndUpdateSidebar_2_none() {
        fetch('data2.txt')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text();  // Read the response as plain text
          })
          .then(data => {
            if (data !== lastFetchedData_2) {
              // Only update if the data has changed
              lastFetchedData_2 = data;
    
              // Insert the fetched data into the sidebar
              document.getElementById('sidebar').innerHTML = data;
    
              // Run the sidebar formatting and initialization code after the data is loaded
              collapseAllSubItems();
              sortCategories(); // Ensure categories are sorted first
    
              // Update all category titles in the sidebar with user counts
              document.querySelectorAll('.category').forEach(categoryElement => {
                  updateSidebarCategoryCount(categoryElement.dataset.category);
              });
    
              // Re-expand the last opened category if it exists
              if (lastOpenedCategory_2) {
                  toggleSubItems(lastOpenedCategory_2);
              }
    
              console.log("Sidebar updated with new data");
            } else {
              console.log("No changes detected in data.txt");
            }
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
    }
  // Function to fetch and update numbers
  function fetchAndUpdateNumbers_2() {
      fetch('numbers2.txt')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.text(); // Read the response as plain text
          })
          .then(data => {
              // Insert the fetched data into the streamdata div
              document.getElementById('streamdata').innerHTML = data;
              console.log("Stream data updated with new numbers");
          })
          .catch(error => {
              console.error('There was a problem with the fetch operation for numbers:', error);
          });
  }
  function checkResolution() {
    const width = window.screen.width;
    
    if (width === 2560) {
        // Code for 2K resolution
        console.log("This is a 2K resolution monitor");
        // Your specific code for 2K resolution
    } else if (width === 1920) {
        // Code for 1080p resolution
        console.log("This is a 1080p resolution monitor");
        // Your specific code for 1080p resolution
    } else {
        // Code for other resolutions
        console.log("This is not a 2K or 1080p resolution monitor");
        // Your specific code for other resolutions
    }
}
// Run the check on page load
checkResolution();

// Add an event listener for window resize
window.addEventListener('resize', function() {
    checkResolution();
});

// Function to collapse all sub-items
function collapseAllSubItems() {
    var subItems = document.querySelectorAll('.sub-item[data-category]');
    subItems.forEach(function(subItem) {
        subItem.style.display = 'none';
    });
}
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
        lastOpenedCategory = category; // Update the last opened category
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
            title.textContent = ' - ' + subItem.getAttribute('data-title');
        
            var streamTitle = subItem.getAttribute('data-title') || '';

            // Check if the title indicates a Kick stream (no need for username list anymore)
            var isKickStream = streamTitle.includes("🟢🟢Kick Stream☝️");

            if (isKickStream) {
                viewerCount.textContent = '🟢' + subItem.getAttribute('data-viewers');
            } else {
                viewerCount.textContent = '🔴' + subItem.getAttribute('data-viewers');
            }
        
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

        groupTitle.innerHTML = `${categoryName.trim()} <span class="user-count">(${numberOfUsers})</span> <span class="grid-link">[grid view]</span>`;

        document.querySelector('.grid-link').addEventListener('click', function() {
            window.location.href = url;
        });

        const sidebarCategory = document.querySelector(`.category[data-category="${category}"]`);
        if (sidebarCategory) {
            const currentSidebarTitle = sidebarCategory.textContent.split(' (')[0];
            sidebarCategory.innerHTML = `${currentSidebarTitle} <span class="user-count">(${numberOfUsers})</span>`;
        }
    }
}
function playStream(streamName) {
    var player = document.getElementById('player');
    var chat = document.getElementById('chat');
    var lowerCaseStreamName = streamName.toLowerCase();
    
    // Find the sub-item element for the specified username
    var streamElement = Array.from(document.querySelectorAll('.sub-item')).find(function(item) {
        return item.querySelector('.username').textContent.trim().toLowerCase() === lowerCaseStreamName;
    });

    if (!streamElement) return;

    // Get the stream title
    var title = streamElement.getAttribute('data-title') || '';

    // Determine if it's a Kick stream based on title
    var isKickStream = title.includes("🟢🟢Kick Stream☝️");

    // Update the player and chat source dynamically
    if (isKickStream) {
        player.src = `https://player.kick.com/${lowerCaseStreamName}?muted=false&autoplay=true`;
        chat.src = `https://streamcompanion.app/kick/${lowerCaseStreamName}/chat`;
    } else {
        player.src = `https://player.twitch.tv/?channel=${streamName}&parent=gta-rp-playlist.github.io&parent=127.0.0.1&autoplay=true&muted=false&quality=chunked`;
        chat.src = `https://www.twitch.tv/embed/${streamName}/chat?parent=gta-rp-playlist.github.io&parent=127.0.0.1&darkpopout`;
    }

    // Display the current stream name and title
    var streamInfo = document.getElementById('streamInfo');
    streamInfo.innerHTML = `<div class="stream-name">${streamName}</div><div class="stream-title">${title}</div>`;

    // Highlight the clicked username
    highlightClickedUsername(lowerCaseStreamName);
}
// Function to highlight the clicked username or the default stream on page load
function highlightClickedUsername(streamName) {
    // Remove the highlight from all sub-items in the sidebar
    document.querySelectorAll('.sub-item').forEach(function(subItemElement) {
        subItemElement.classList.remove('highlighted-sub-item');
    });

    // Find the sub-item element for the specified stream and add the highlight class in the sidebar
    var subItemElement = Array.from(document.querySelectorAll('.sub-item')).find(function(element) {
        return element.querySelector('.username').textContent.trim().toLowerCase() === streamName;
    });

    if (subItemElement) {
        subItemElement.classList.add('highlighted-sub-item');
    }

    // Remove the highlight from all divs in the usernamesList
    var usernameDivs = document.querySelectorAll('#usernamesList > div');
    usernameDivs.forEach(function(div) {
        div.classList.remove('highlighted-title-div');
    });

    // Highlight the entire title div in the usernamesList
    var targetDiv = Array.from(usernameDivs).find(function(div) {
        return div.querySelector('.username-bubble').textContent.trim().toLowerCase() === streamName;
    });

    if (targetDiv) {
        targetDiv.classList.add('highlighted-title-div');
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const TeamItem = document.createElement("li");
    
    // Create the "New" text and style it
    const newText = document.createElement("span");

    // Create the link and append the "New" text to it
    const link = document.createElement("a");
    link.href = "/team.html";
    link.innerHTML = "Join the Team";
    link.appendChild(newText);

    // Add the link to the survival item
    TeamItem.appendChild(link);

    // Prepend the new item to the menu
    document.querySelector("#top-menu ul").append(TeamItem);
});
document.addEventListener("DOMContentLoaded", function () {
    const pollItem = document.createElement("li");
    pollItem.style.position = "relative"; // Ensure dropdown positioning works
    pollItem.style.listStyle = "none"; // Remove default list styling

    // Create the "New" text and style it
    const newText = document.createElement("span");
    newText.textContent = " New";
    newText.style.color = "yellow";
    newText.style.fontSize = "0.8em";
    newText.style.verticalAlign = "super";  // Makes it look like an exponent;

    // Create the link (without href)
    const link = document.createElement("span"); // Use <span> instead of <a> since it's not a link
    link.innerHTML = "Poll📊";
    link.style.cursor = "pointer"; // Make it look clickable
    link.style.display = "inline-block";
    link.style.padding = "8px 12px";
    link.style.color = "#fff"; // Adjust text color
    link.style.fontSize = "1em";

    // Create the dropdown container for the poll
    const pollDropdown = document.createElement("div");
    pollDropdown.classList.add("poll-dropdown");
    pollDropdown.innerHTML = `
        <div class="strawpoll-embed" id="strawpoll_3RnYXdYoQye" style="height: 480px; max-width: 640px; width: 100%; margin: 0 auto; display: flex; flex-direction: column;">
            <iframe title="StrawPoll Embed" id="strawpoll_iframe_3RnYXdYoQye" src="https://strawpoll.com/embed/3RnYXdYoQye" style="width: 100%; height: 100%; border: none;" allowfullscreen allowtransparency></iframe>
        </div>
    `;

    // Improved Dropdown Styling
    pollDropdown.style.position = "absolute";
    pollDropdown.style.top = "100%";
    pollDropdown.style.left = "50%";
    pollDropdown.style.transform = "translateX(-50%)"; // Center the dropdown
    pollDropdown.style.background = "#2c2f33";
    pollDropdown.style.padding = "12px";
    pollDropdown.style.border = "1px solid #444";
    pollDropdown.style.borderRadius = "6px";
    pollDropdown.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)";
    pollDropdown.style.display = "none"; // Initially hidden
    pollDropdown.style.zIndex = "105";
    pollDropdown.style.width = "320px"; // Adjust width for better fit

    // Append elements
    link.appendChild(newText);
    pollItem.appendChild(link);
    pollItem.appendChild(pollDropdown);
    document.querySelector("#top-menu ul").append(pollItem);

    // Show/hide dropdown on hover
    pollItem.addEventListener("mouseenter", () => {
        pollDropdown.style.display = "block";
    });

    pollItem.addEventListener("mouseleave", () => {
        pollDropdown.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 600) return; // Don't run on mobile

    const sidebar = document.getElementById("sidebar");
    const player = document.getElementById("player");
    const chatIframe = document.getElementById("chat");
    const streamInfo = document.getElementById("streamInfo");
    const usernamesContainer = document.getElementById("usernamesContainer");
    let hideTimeout;

    function hideSidebar(delay) {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!sidebar.matches(":hover")) { // Only hide if sidebar is not being hovered
                sidebar.classList.add("hidden");
                player.style.width = '93%';
                player.style.height = '92%';
                player.style.left = '-14%';
                streamInfo.style.left = '-14%';
                streamInfo.style.bottom = '1%';
                usernamesContainer.style.left = '-12%';
                chatIframe.style.left = '82%';
                document.body.classList.add("sidebar-hidden");
            }
        }, delay);
    }

    sidebar.addEventListener("mouseleave", () => hideSidebar(8050));

    sidebar.addEventListener("mouseenter", () => {
        clearTimeout(hideTimeout);
        sidebar.classList.remove("hidden");
        player.style.left = '0%';
        streamInfo.style.left = '0%';
        streamInfo.style.bottom = '9%';
        player.style.height = '84%';
        player.style.width = '82%';
        usernamesContainer.style.left = '1%';
        chatIframe.style.left = '82%';
        chatIframe.style.width = '17.9%';
        document.body.classList.remove("sidebar-hidden");
        hideSidebar(8000);
    });

    hideSidebar(9000); // Auto-hide initially if not hovered

});
// Automatically highlight the stream that plays on page load
document.addEventListener('DOMContentLoaded', function() {
    fetch('changelog.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        // Insert the fetched data into the tooltip
        const tooltip = document.querySelector('.tooltip');
        tooltip.innerHTML = data; // Set the tooltip content
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    // Wait for a slight delay to ensure all elements are rendered
    setTimeout(function() {
        // Get the currently highlighted stream in the sidebar
        var highlightedSubItem = document.querySelector('.sub-item.highlighted-sub-item');

        // If a stream is highlighted in the sidebar, highlight it in the usernamesList
        if (highlightedSubItem) {
            var defaultStreamName = highlightedSubItem.querySelector('.username').textContent.trim().toLowerCase();
            highlightClickedUsername(defaultStreamName);
        } else {
            console.log('No stream is highlighted in the sidebar.');
        }
    }, 100); // Adjust the delay if needed
});
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
document.getElementById('suggestion-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            form.reset();
            document.getElementById('response-message').style.display = 'block';
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }
            })
        }
    }).catch(error => {
        alert("Oops! There was a problem submitting your form");
    });
});
function updateSidebarCategoryCount(category) {
    const clickedSubItems = document.querySelectorAll('.sub-item[data-category="' + category + '"]');
    
    // Filter out duplicates based on the username
    const uniqueSubItems = Array.from(clickedSubItems).filter(function(subItem, index, self) {
        const username = subItem.querySelector('.username').textContent.trim().toLowerCase();
        return index === self.findIndex(function(s) {
            return s.querySelector('.username').textContent.trim().toLowerCase() === username;
        });
    });

    // Update the corresponding sidebar category with the number of users
    const sidebarCategory = document.querySelector(`.category[data-category="${category}"]`);
    if (sidebarCategory) {
        const currentSidebarTitle = sidebarCategory.textContent.split(' (')[0];
        sidebarCategory.innerHTML = `${currentSidebarTitle} <span class="user-count">(${uniqueSubItems.length})</span>`;
    }
}
// Add an event listener for the sidebar to handle category clicks
document.getElementById('sidebar').addEventListener('click', function(event) {
    var target = event.target;
    if (target.classList.contains('category')) {
        // Toggle the sub-items for the clicked category
        toggleSubItems(target.dataset.category);
        
        // Remove the # part from the URL
        if (window.location.hash) {
            // Update the URL to remove the hash without reloading the page
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        // Clear the user parameter from the URL
        const url = new URL(window.location.href);
        url.searchParams.delete('user'); // Remove the 'user' parameter
        history.replaceState(null, '', url); // Update the URL without reloading
    }

    // Add similar logic for handling user clicks if applicable
    if (target.classList.contains('username')) {
        // Clear the user parameter from the URL
        const url = new URL(window.location.href);
        url.searchParams.delete('user'); // Remove the 'user' parameter
        history.replaceState(null, '', url); // Update the URL without reloading
    }
});
function highlightCategory(category) {
    var categories = document.getElementsByClassName('category');
    for (var i = 0; i < categories.length; i++) {
        categories[i].classList.remove('highlighted');
    }
    category.classList.add('highlighted');
}
let lastFetchedData = ''; // Store the last fetched data
let lastOpenedCategory = null; // Store the last opened category






window.onload = function() {
    fetchAndUpdateSidebar();
    fetchAndUpdateNumbers(); // Fetch the numbers on page load

};

// Re-fetch the file and update the sidebar every 60 seconds (adjust as needed)
setInterval(fetchAndUpdateSidebar_none, 120000); // 30,000ms = .5 minute
setInterval(fetchAndUpdateNumbers, 120000); // 30,000ms = 30 seconds
