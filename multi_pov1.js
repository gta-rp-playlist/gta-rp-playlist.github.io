// Document ready function to set up event listeners
document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('Main_content');
    const floatingBox = document.getElementById('floatingBox');
    const usernameInput = document.getElementById('usernameInput');
    const clearAllButton = document.getElementById('clearAllButton');
    const toggleSidebarButton = document.getElementById('toggleSidebarButton');
    const hideAllButton = document.getElementById('hideallbutton');
    const hideButton = document.getElementById("hide");


    let player = []; // Array to hold usernames

    function fetchData() {
        fetch('data.txt')
            .then(response => response.text())
            .then(data => {
                sidebar.innerHTML = data;
                removeDuplicateUsernames(); // Remove duplicate usernames first
                sortCategories();
                collapseAllSubItems();
                addCategoryClickListeners();
                updateCategoryUserCounts();
            })
            .catch(error => console.error('Error fetching the data:', error));
    }

    // Initial fetch when the document is loaded
    fetchData();

    // Set up interval to refresh data every 2 minutes (120,000 milliseconds)
    setInterval(fetchData, 120000);

    // Function to remove duplicate usernames in the sidebar while allowing different categories
    function removeDuplicateUsernames() {
        const subItems = document.querySelectorAll('.sub-item');
        const seenUsernames = new Map(); // Map to track usernames and their associated categories

        subItems.forEach(subItem => {
            const username = subItem.querySelector('.username').textContent.trim(); // Get the username from the correct element
            const category = subItem.getAttribute('data-category'); // Get the category from the sub-item

            if (!seenUsernames.has(username)) {
                seenUsernames.set(username, new Set()); // Initialize a Set for categories if username is new
            }

            const categories = seenUsernames.get(username);

            // If the category is already associated with the username, remove the sub-item
            if (categories.has(category)) {
                subItem.remove(); // Remove the duplicate sub-item if username-category pair exists
            } else {
                categories.add(category); // Add the category to the username's Set
            }
        });
    }


    toggleSidebarButton.addEventListener('click', () => {
        const isHidden = sidebar.classList.toggle('hidden'); // Toggle the sidebar visibility

        // Toggle the main content's collapsed/expanded state
        mainContent.classList.toggle('collapsed', !isHidden);
        mainContent.classList.toggle('expanded', isHidden);

        // Update the button text based on sidebar visibility
        toggleSidebarButton.textContent = isHidden ? 'Show Sidebar' : 'Hide Sidebar';

        // Toggle the floating box visibility based on sidebar visibility
        floatingBox.classList.toggle('hidden', isHidden); // Add 'hidden' class if sidebar is hidden

        const numPlayers = player.length;
        if (numPlayers === 1 && isHidden) {
            // When hidden: Show 1 player taking full width and height
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const playerWidth = viewportWidth; // Full width for the player
            const playerHeight = Math.floor(playerWidth * (9 / 16)); // Calculate height for 16:9 aspect ratio

            // Center the player vertically
            const topOffset = (viewportHeight - playerHeight) / 2;

            const player = document.getElementById('twitch-player-1');
            if (player) {
                player.style.position = 'absolute';
                player.style.top = `0%`; // Center player vertically
                player.style.left = '0'; // Align to the left
                player.style.width = `${playerWidth}px`; // Full width
                player.style.height = `100%`; // Height for 16:9
            }
        } else if (numPlayers === 1 && !isHidden) {
            // When not hidden: Show 1 player with 88% width, centered
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth; // Calculate available width considering the sidebar

            const playerWidth = availableWidth * 0.88; // 88% width for the player
            const playerHeight = Math.floor(playerWidth * (9 / 16)); // Calculate height for 16:9 aspect ratio

            // Center the player vertically
            const topOffset = (viewportHeight - playerHeight) / 2;

            const player = document.getElementById('twitch-player-1');
            if (player) {
                player.style.position = 'absolute';
                player.style.top = `0%`; // Center player vertically
                player.style.left = `12%`; // Center horizontally, accounting for sidebar
                player.style.width = `88%`; // Set width for the player
                player.style.height = `100%`; // Set height for 16:9
            }
        }
        if (numPlayers === 2 && isHidden) {
            // When hidden: Show 2 players side by side
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const playerWidth = viewportWidth / 2; // Each player takes half the width
            const playerHeight = Math.floor(playerWidth * (9 / 16)); // Calculate height for 16:9 aspect ratio

            // Calculate top offset to center players vertically
            const topOffset = (viewportHeight - playerHeight) / 2;

            for (let i = 0; i < 2; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${topOffset}px`; // Center players vertically
                    player.style.left = `${i * playerWidth}px`; // Position side by side
                    player.style.width = `${playerWidth}px`; // Set width
                    player.style.height = `${playerHeight}px`; // Set height for 16:9
                }
            }
        } else if (numPlayers === 2 && !isHidden) {
            // When not hidden: Show 2 players on top and 1 player on bottom with 12% sidebar consideration
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth; // Calculate available width considering the sidebar

            // Calculate player width and height
            const playerWidth = (availableWidth * 0.44); // 44% width for each of the top players
            const playerHeight = Math.floor(playerWidth * (9 / 16)); // Calculate height for 16:9 aspect ratio

            // Calculate top offset to center players vertically in the top half
            const topOffset = (playerHeight / 2); // Center vertically in the top half

            for (let i = 0; i < 3; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';

                    if (i < 2) {
                        // Position Players 1 and 2 on the top half
                        player.style.top = `${topOffset}px`; // Center players vertically in the top half
                        player.style.left = `${12 + (i * 44)}%`; // Position side by side
                        player.style.width = '44%'; // Set width for both players
                        player.style.height = `${playerHeight}px`; // Set height for 16:9
                    } else {
                        // Position Player 3 in the bottom half and center it vertically
                        const bottomPlayerTopOffset = (viewportHeight - playerHeight) / 2;
                        player.style.top = `${bottomPlayerTopOffset}px`; // Center vertically
                        player.style.left = `${(availableWidth - (availableWidth / 2)) / 2 + sidebarWidth}px`; // Center Player 3 horizontally
                        player.style.width = '50%'; // Set width for the bottom player
                        player.style.height = `${playerHeight}px`; // Set height for 16:9
                    }
                }
            }
        }
        if (numPlayers === 3 && isHidden) {
            // When hidden: Show 2 players on top and 1 player on the bottom
            for (let i = 0; i < 3; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = i < 2 ? '0' : '50%'; // Top half for first 2, bottom half for last

                    if (i < 2) {
                        player.style.left = (i % 2) * 50 + '%'; // Left half for odd indexes, right half for even
                        player.style.width = '50%'; // 50% width for top players
                    } else {
                        player.style.left = '25%'; // Center Player 3 horizontally
                        player.style.width = '50%'; // 50% width for bottom player
                    }

                    player.style.height = '50%'; // All players take half the height
                }
            }
        } else if (numPlayers === 3 && !isHidden) {
            // When not hidden: Show 2 players on top and 1 player on bottom with 12% sidebar consideration
            const viewportWidth = window.innerWidth;
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth; // Calculate available width considering the sidebar

            for (let i = 0; i < 3; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.height = '50%'; // Maintain half height for all players

                    if (i < 2) {
                        // Position Players 1 and 2 on the top half
                        player.style.top = '0'; // Align to the top of the viewport
                        player.style.left = `${12 + (i % 2) * 44}%`;
                        player.style.width = '44%';
                    } else {
                        // Position Player 3 in the center of the bottom half
                        player.style.top = '50%'; // Align to the bottom half
                        player.style.left = `${(availableWidth - (availableWidth / 2)) / 2 + sidebarWidth}px`; // Center horizontally, including sidebar
                        player.style.width = '50%';
                    }
                }
            }
        }
        if (numPlayers === 4 && isHidden) {
            for (let i = 0; i < 4; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = i < 2 ? '0' : '50%'; // Top half for first 2, bottom half for last 2
                    player.style.left = (i % 2) * 50 + '%'; // Left half for odd indexes, right half for even
                    player.style.width = '50%';
                    player.style.height = '50%';
                }
            }
        } else if (numPlayers === 4 && !isHidden) {
            for (let i = 0; i < 4; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = i < 2 ? '0' : '50%';
                    player.style.left = `${12 + (i % 2) * 44}%`;
                    player.style.width = '44%';
                    player.style.height = '50%';
                }
            }
        }
        // Logic for 5 players
        if (numPlayers === 5 && isHidden) {
            const player1 = document.getElementById(`twitch-player-1`);
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.top = '0';
                player1.style.left = '0';
                player1.style.width = '79%';
                player1.style.height = '100%';
            }
        } else if (numPlayers === 5 && !isHidden) {
            const player1 = document.getElementById(`twitch-player-1`);
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.top = '0';
                player1.style.left = '12%';
                player1.style.width = '67%';
                player1.style.height = '100%';
            }
        }

        // Logic for 6 players
        if (numPlayers === 6 && isHidden) {
            const width = 33; // 33% width
            const heightInPixels = (window.innerWidth * width / 100) * (9 / 16); // Pixel height for 16:9 aspect ratio

            // Calculate center alignment by positioning the top row's bottom at the center of the viewport
            const topRowOffset = `calc(50vh - ${heightInPixels}px)`;

            for (let i = 0; i < 3; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = topRowOffset; // Center the bottom of the top row
                    player.style.left = `${i * width}%`;
                    player.style.width = `${width}%`;
                    player.style.height = `${heightInPixels}px`; // Use pixel height to prevent overlap
                }
            }
            for (let i = 3; i < 6; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `calc(50vh)`; // Position the top of the bottom row at the center
                    player.style.left = `${(i - 3) * width}%`;
                    player.style.width = `${width}%`;
                    player.style.height = `${heightInPixels}px`;
                }
            }
        } else if (numPlayers === 6 && !isHidden) {
            const width = 30; // 30% width
            const height = (width / 16) * 9; // Height for 16:9 aspect ratio in viewport width units (vw)
            const topRowOffset = `calc(50vh - ${height}vw)`; // Offset to center the bottom of the top row

            for (let i = 0; i < 3; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = topRowOffset; // Center the bottom of the top row
                    player.style.left = `${12 + i * 29}%`;
                    player.style.width = `${width}%`;
                    player.style.height = `${height}vw`; // 16:9 height to remove black bars
                }
            }
            for (let i = 3; i < 6; i++) {
                const player = document.getElementById(`twitch-player-${i + 1}`);
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `50vh`; // Position the top of the bottom row at the center
                    player.style.left = `${12 + (i - 3) * 29}%`;
                    player.style.width = `${width}%`;
                    player.style.height = `${height}vw`;
                }
            }
        }

        // Logic for 7 players
        if (numPlayers === 7 && isHidden) {
            const player1 = document.getElementById('twitch-player-1');
            const players = [];
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            // Calculate the available height for Players 2-4 (right column)
            const rightColumnHeight = Math.floor(viewportHeight / 3); // Round down the height for each player
            const rightColumnWidth = (rightColumnHeight * 16) / 9; // Maintain 16:9 aspect ratio for width
            const availableWidth = viewportWidth; // Remaining width after accounting for sidebar
            const availableHeight = viewportHeight; // Adjust for any margins/padding
            // Get players 2 to 7
            for (let i = 2; i <= 7; i++) {
                players.push(document.getElementById(`twitch-player-${i}`));
            }

            if (player1) {
                // Move player1 to the far left and expand its size
                player1.style.position = 'absolute';
                player1.style.left = '0';
                player1.style.height = '71%'; // Full height
                player1.style.width = '69%'; // Take up 67% of the width
            }
            const player1WidthPixels = (parseFloat(player1.style.width) / 100) * viewportWidth;
            const player1HeightPixels = (parseFloat(player1.style.height) / 100) * viewportHeight;

            // Adjust the positioning and size for players 2-4 (right column)
            players.slice(0, 3).forEach((player, index) => {
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${index * rightColumnHeight}px`; // Stack them vertically
                    player.style.left = `${player1WidthPixels}px`; // Use player1's width for positioning
                    player.style.width = `${rightColumnWidth}px`; // Maintain 16:9 aspect ratio
                    player.style.height = `${rightColumnHeight}px`; // Each takes up a third of the height
                }
            });
            // Get the width of Player 2 (right column's first player)
            const player2Width = rightColumnWidth;

            // Calculate the remaining width after accounting for Player 2's width
            const remainingWidth = viewportWidth - player2Width;

            // Calculate the width for Players 5-7 (bottom row), using the remaining width divided by 3
            const bottomRowWidth = remainingWidth / 3;
            const bottomRowHeight = (bottomRowWidth * 9) / 16; // Maintain 16:9 aspect ratio for height

            const scaleFactor = 0.96; // Scale down the size to 90%

            players.slice(3, 6).forEach((player, index) => {
                if (player) {
                    const scaledWidth = bottomRowWidth * scaleFactor; // Scale the width down
                    const scaledHeight = bottomRowHeight * scaleFactor; // Scale the height down

                    player.style.position = 'absolute';
                    player.style.top = `${player1HeightPixels}px`; // Place them at the bottom
                    player.style.left = `${(index * scaledWidth)}px`; // Spread them horizontally across the remaining width
                    player.style.width = `${scaledWidth}px`; // Each takes up 90% of the remaining width
                    player.style.height = `${scaledHeight}px`; // Maintain the scaled 16:9 aspect ratio
                    player.style.marginTop = '1px'; // Add 1px top margin
                }
            });
        } else if (numPlayers === 7 && !isHidden) {
            const player1 = document.getElementById('twitch-player-1');
            const players = [];

            // Get players 2 to 7
            for (let i = 2; i <= 7; i++) {
                players.push(document.getElementById(`twitch-player-${i}`));
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                document.body.appendChild(otherPlayersContainer); // Append to body if it's created
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.top = '0';
            otherPlayersContainer.style.right = '0';

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = viewportWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = viewportHeight; // Adjust for any margins/padding


            if (player1) {
                // Move player1 to the far left and apply scaling
                player1.style.position = 'absolute';
                player1.style.left = '12%';
                player1.style.width = `58%`;
                player1.style.height = `75%`;
            }
            // Calculate height and width for Player 1 maintaining 16:9 aspect ratio
            let player1Height = (parseFloat(player1.style.height) / 100) * viewportHeight;
            let player1Width = (parseFloat(player1.style.width) / 100) * viewportWidth;

            // Calculate the available height for Players 2-4 (right column)
            const rightColumnHeight = Math.floor(viewportHeight / 3); // 3 players vertically, round down
            const rightColumnWidth = Math.floor((rightColumnHeight * 16) / 9); // Calculate width based on the height
            const player1WidthPixels = (parseFloat(player1.style.width) / 100) * viewportWidth;

            // Adjust the positioning and size for players 2-4 (right column)
            players.slice(0, 3).forEach((player, index) => {
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${index * (rightColumnWidth * 9) / 16}px`; // Stack them vertically
                    player.style.marginLeft = '1px'; // Add 1px top margin
                    // Adjust for slight margins and align to the right edge of the viewport without causing overflow
                    player.style.left = `calc(12% + ${player1Width}px)`; // Adjust by 10px to avoid scroll
                    player.style.width = `${rightColumnWidth}px`; // Maintain 16:9 aspect ratio
                    player.style.height = `${(rightColumnHeight)}px`; // Each takes up a third of the height
                }
            });

            // Use Player 1's width to align the bottom players
            const bottomPlayerWidth = player1Width / 3; // Divide Player 1's width by 3 for Players 5-7
            const bottomPlayerHeight = (bottomPlayerWidth * 9) / 16; // Maintain 16:9 aspect ratio for height

            // Adjust size and position for Players 5-7 (bottom row)
            players.slice(3, 6).forEach((player, index) => {
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${player1Height}px`; // Place them just after Player 1's height
                    player.style.left = `calc(12% + ${index * bottomPlayerWidth}px)`; // Spread them horizontally with a 12% shift
                    player.style.width = `${bottomPlayerWidth}px`; // Each player takes 1/3 of Player 1's width
                    player.style.height = `${bottomPlayerHeight}px`; // Maintain the 16:9 aspect ratio
                }
            });
        }
        // Logic for 8 players
        if (numPlayers === 8 && isHidden) {
            const player1 = document.getElementById('twitch-player-1');
            const players = [];

            // Get players 2 to 8
            for (let i = 2; i <= 8; i++) {
                players.push(document.getElementById(`twitch-player-${i}`));
            }

            // Stretch Player 1 to fill the top
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.left = '0';
                player1.style.width = '75%'; // Player 1 takes up 75% of the screen width
                player1.style.height = '74%'; // Top 74% of the screen
            }

            // Calculate the width and height for the right column
            const player1RightEdge = player1.offsetLeft + player1.offsetWidth; // The right edge of Player 1
            const remainingHeight = window.innerHeight - (window.innerHeight * 0.26); // Remaining height after the bottom row
            const rightColumnHeight = remainingHeight / 3; // Divide remaining height by 3 for the 3 right-column players
            const rightColumnWidth = (rightColumnHeight * 16) / 9; // Maintain 16:9 aspect ratio for right column players

            // Adjust Players 2-4 (right column)
            players.slice(0, 3).forEach((player, index) => {
                if (player) {
                    player.style.position = 'absolute';
                    player.style.left = `${player1RightEdge}px`; // Position right next to Player 1
                    player.style.width = `${rightColumnWidth}px`; // Set width to maintain 16:9 aspect ratio

                    // For the last player, place it above the bottom row
                    if (index === 2) {
                        player.style.top = `${remainingHeight - rightColumnHeight}px`; // Align above the bottom row
                    } else {
                        player.style.top = `${index * rightColumnHeight}px`; // Stack vertically
                    }

                    player.style.height = `${rightColumnHeight}px`; // Set height for each player
                }
            });

            // Adjust the bottom row (players 5-8)
            const totalWidth = player1RightEdge + rightColumnWidth; // Total width of Player 1 + right column
            const availableWidthForBottomRow = totalWidth; // Use total width to match the right column
            const playerHeight = window.innerHeight * 0.26; // 26% of the height for bottom row
            const playerWidth = availableWidthForBottomRow / 4; // Divide the total width by 4 to fit 4 players

            players.slice(3, 7).forEach((player, index) => {
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '74%'; // Place them in the bottom row
                    player.style.left = `${index * playerWidth}px`; // Spread players horizontally
                    player.style.width = `${playerWidth}px`; // Set width to evenly spread them across the available space
                    player.style.height = `${playerHeight}px`; // Set height maintaining 16:9 ratio
                }
            });
        } else if (numPlayers === 8 && !isHidden) {
            const player1 = document.getElementById('twitch-player-1');
            const players = [];

            // Get players 2 to 8
            for (let i = 2; i <= 8; i++) {
                players.push(document.getElementById(`twitch-player-${i}`));
            }

            // Stretch Player 1 to fill the top
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.left = '12%';
                player1.style.width = '64%'; // Player 1 takes up 75% of the screen width
                player1.style.height = '74%'; // Top 74% of the screen
            }

            // Calculate the width and height for the right column
            const player1RightEdge = player1.offsetLeft + player1.offsetWidth; // The right edge of Player 1
            const remainingHeight = window.innerHeight - (window.innerHeight * 0.26); // Remaining height after the bottom row
            const rightColumnHeight = remainingHeight / 3; // Divide remaining height by 3 for the 3 right-column players
            const rightColumnWidth = (rightColumnHeight * 16) / 9; // Maintain 16:9 aspect ratio for right column players

            // Adjust Players 2-4 (right column)
            players.slice(0, 3).forEach((player, index) => {
                if (player) {
                    player.style.position = 'absolute';
                    player.style.left = `${player1RightEdge}px`; // Position right next to Player 1
                    player.style.width = `${rightColumnWidth}px`; // Set width to maintain 16:9 aspect ratio

                    // For the last player, place it above the bottom row
                    if (index === 2) {
                        player.style.top = `${remainingHeight - rightColumnHeight}px`; // Align above the bottom row
                    } else {
                        player.style.top = `${index * rightColumnHeight}px`; // Stack vertically
                    }

                    player.style.height = `${rightColumnHeight}px`; // Set height for each player
                }
            });

            // Adjust the bottom row (players 5-8)
            // Adjust the bottom row (players 5-8)
            const sidebarWidth = window.innerWidth * 0.12; // 12% of the window width for the sidebar
            const totalWidth = window.innerWidth - sidebarWidth; // Total width minus the sidebar width
            const availableWidthForBottomRow = totalWidth; // Use adjusted total width
            const playerHeight = window.innerHeight * 0.26; // 26% of the height for bottom row
            const playerWidth = availableWidthForBottomRow / 4; // Divide the adjusted total width by 4 to fit 4 players

            players.slice(3, 7).forEach((player, index) => {
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '74%'; // Place them in the bottom row
                    player.style.left = `${sidebarWidth + index * rightColumnWidth}px`; // Start position after the sidebar
                    player.style.width = `${rightColumnWidth}px`; // Set width to evenly spread them across the available space
                    player.style.height = `${rightColumnHeight}px`; // Set height maintaining 16:9 ratio
                }
            });
        }
        if (numPlayers === 9 && isHidden) {
            // Ensure player 1 container is adjusted separately
            const player1 = document.getElementById('twitch-player-1');
            const players = [];

            // Get players 2 to 9
            for (let i = 2; i <= 9; i++) {
                players.push(document.getElementById(`twitch-player-${i}`));
            }

            // Sidebar logic
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (window.innerWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = window.innerWidth; // Full available width
            const availableHeight = window.innerHeight; // Full height

            // Create or find the container for players 2-9
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                document.getElementById('playerContainer').appendChild(otherPlayersContainer); // Append to the playerContainer
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Full width
            otherPlayersContainer.style.height = '100%'; // Full height
            otherPlayersContainer.style.overflow = 'hidden'; // Prevent overflow

            // Calculate dimensions for bottom row players (16:9 aspect ratio)
            const bottomRowPlayerWidth = availableWidth / 5.1; // Reduced width to prevent overfilling
            const bottomRowPlayerHeight = (bottomRowPlayerWidth * 9) / 16 * 0.95; // Reduce height slightly by multiplying by 0.95

            // Adjust Player 1 height (remaining space after bottom row)
            const player1Height = availableHeight - bottomRowPlayerHeight; // Player 1's height is the remaining viewport height
            const player1Width = (player1Height * 16) / 9; // Maintain 16:9 aspect ratio for Player 1's width

            // Adjust Player 1 (Top Left)
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.top = '0'; // Top position
                player1.style.left = '0'; // Left position
                player1.style.width = `${player1Width}px`; // Calculated width based on 16:9 aspect ratio
                player1.style.height = `${player1Height}px`; // Calculated height based on available space
            }

            // Position Players 5-9 (Bottom Row, stacked horizontally below Player 1)
            const bottomRowTopOffset = player1Height; // Bottom row is positioned right below Player 1
            for (let i = 4; i <= 8; i++) {
                const player = players[i - 1];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`; // Position below Player 1
                    player.style.left = `${(i - 4) * bottomRowPlayerWidth}px`; // Position each player next to the previous one
                    player.style.width = `${bottomRowPlayerWidth}px`; // Fill the width of the viewport with 5 players
                    player.style.height = `${bottomRowPlayerHeight}px`; // Reduced height to prevent overflow
                }
            }

            // Get the right position of Player 1
            const player1RightEdge = parseFloat(player1.style.left) + parseFloat(player1.style.width);

            // Position Players 2-4 (Column, stacked vertically to the right of Player 1)
            for (let i = 1; i <= 3; i++) {
                const player = players[i - 1];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${(i - 1) * bottomRowPlayerHeight}px`; // Stack vertically
                    player.style.left = `${player1RightEdge}px`; // Positioned to the right of Player 1
                    player.style.width = `${bottomRowPlayerWidth}px`; // Use the same width as the bottom row
                    player.style.height = `${bottomRowPlayerHeight}px`; // Maintain reduced height to match the bottom row
                }
            }

        } else if (numPlayers === 9 && !isHidden) {
            const player1 = document.getElementById('twitch-player-1');
            const players = [];

            // Get players 2 to 9
            for (let i = 2; i <= 9; i++) {
                players.push(document.getElementById(`twitch-player-${i}`));
            }

            // Sidebar visibility and width calculations
            const sidebarWidth = window.innerWidth * 0.12; // 12% of the window width for sidebar
            const availableWidth = window.innerWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = window.innerHeight; // Use full height

            // Calculate dimensions for players (16:9 aspect ratio)
            const playerWidth = availableWidth / 4 * 0.9; // Reduce width by 10% for smaller video sizes
            const playerHeight = (playerWidth * 9) / 16; // Maintain 16:9 aspect ratio for player height

            // Shift amount for right alignment
            const shiftAmount = sidebarWidth; // Shift by the width of the sidebar

            // Position Players 2-5 (Top Row)
            for (let i = 1; i <= 4; i++) {
                const player = players[i - 1];
                player.style.position = 'absolute';
                player.style.top = '0'; // Align to the top
                player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 1 in the middle (between top and bottom rows) with reduced size
            const player1Width = availableWidth * 0.5; // Player 1 width (50% of the available width)
            const player1Height = (player1Width * 9) / 16; // Maintain 16:9 aspect ratio for Player 1

            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`; // Position Player 1 right after the top row
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`; // Center Player 1 horizontally
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`; // Maintain 16:9 aspect ratio

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height; // Bottom row just below Player 1
            for (let i = 5; i <= 8; i++) {
                const player = players[i - 1];
                player.style.position = 'absolute';
                player.style.top = `${bottomRowTopOffset}px`; // Position right after Player 1 height
                player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }
        }
        if (numPlayers === 10 && isHidden) {
            // Set up Player 1 separately
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 10
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            // Sidebar logic
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarWidth = sidebarVisible ? (window.innerWidth * 0.12) : 0; // 12% sidebar if visible
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableHeight = window.innerHeight;

            // Container setup for other players
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                document.getElementById('playerContainer').appendChild(otherPlayersContainer);
            }
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%';
            otherPlayersContainer.style.height = '100%';
            otherPlayersContainer.style.overflow = 'hidden';

            // Calculate dimensions for the bottom row players (16:9 aspect ratio)
            const bottomRowPlayerWidth = availableWidth / 5.1;
            const bottomRowPlayerHeight = (bottomRowPlayerWidth * 9) / 16 * 0.95;

            // Set dimensions for Player 1 (top left)
            const player1Height = availableHeight - bottomRowPlayerHeight;
            const player1Width = (player1Height * 16) / 9;
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.top = '0';
                player1.style.left = '0';
                player1.style.width = `${player1Width}px`;
                player1.style.height = `${player1Height}px`;
            }

            // Position Players 6-10 (Bottom Row, horizontally aligned below Player 1)
            const bottomRowTopOffset = player1Height;
            for (let i = 5; i < 10; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`;
                    player.style.left = `${(i - 5) * bottomRowPlayerWidth}px`;
                    player.style.width = `${bottomRowPlayerWidth}px`;
                    player.style.height = `${bottomRowPlayerHeight}px`;
                }
            }

            // Get the right edge of Player 1
            const player1RightEdge = parseFloat(player1.style.left) + parseFloat(player1.style.width);

            // Position Players 2-5 (right column, stacked vertically to the right of Player 1)
            for (let i = 1; i < 5; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${(i - 1) * bottomRowPlayerHeight}px`;
                    player.style.left = `${player1RightEdge}px`;
                    player.style.width = `${bottomRowPlayerWidth}px`;
                    player.style.height = `${bottomRowPlayerHeight}px`;
                }
            }
        } else if (numPlayers === 10 && !isHidden) {
            // Similar setup for when the sidebar is visible
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 10
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            const sidebarWidth = window.innerWidth * 0.12;
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableHeight = window.innerHeight;

            const playerWidth = availableWidth / 5;
            const playerHeight = (playerWidth * 9) / 16;
            const shiftAmount = sidebarWidth;

            // Position top row players (Players 2-5)
            for (let i = 1; i < 5; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '0';
                    player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`;
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                }
            }

            // Position Player 1 centered below top row
            const player1Width = availableWidth * 0.5;
            const player1Height = (player1Width * 9) / 16;
            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`;
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`;
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`;

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height; // Bottom row just below Player 1
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`; // Position right after Player 1 height
                    player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
                }
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            if (player10) {
                player10.style.position = 'absolute';
                player10.style.top = `${playerHeight}px`; // Align with Player 1's bottom
                player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
                player10.style.width = `${playerWidth}px`; // Same width as other players
                player10.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }
        }
        if (numPlayers === 11 && isHidden) {
            // Set up Player 1 separately
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 11
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            // Sidebar logic
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarWidth = sidebarVisible ? (window.innerWidth * 0.12) : 0; // 12% sidebar if visible
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableWidthNoo = window.innerWidth;
            const availableHeight = window.innerHeight;

            // Container setup for other players
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                document.getElementById('playerContainer').appendChild(otherPlayersContainer);
            }
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%';
            otherPlayersContainer.style.height = '100%';
            otherPlayersContainer.style.overflow = 'hidden';

            // Calculate dimensions for top row players (16:9 aspect ratio)
            const topRowPlayerWidth = availableWidth / 5.1; // Space for 5 players
            const topRowPlayerHeight = (topRowPlayerWidth * 9) / 16; // Maintain 16:9 aspect ratio

            // Position Players 2-6 (top row)
            for (let i = 1; i < 6; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '0'; // Align top row with the top of the container
                    player.style.left = `${(i - 1) * topRowPlayerWidth}px`; // Position horizontally
                    player.style.width = `${topRowPlayerWidth}px`;
                    player.style.height = `${topRowPlayerHeight}px`;
                }
            }

            // Calculate dimensions for bottom row players (Players 7-11)
            const bottomRowPlayerWidth = availableWidth / 5.1; // Same width as top row
            const bottomRowPlayerHeight = (bottomRowPlayerWidth * 9) / 16; // Maintain 16:9 aspect ratio

            // Position Players 7-11 (Bottom Row)
            const bottomRowTopOffset = availableHeight - bottomRowPlayerHeight; // Align bottom row to the bottom of the container
            for (let i = 6; i < 11; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`;
                    player.style.left = `${(i - 6) * bottomRowPlayerWidth}px`; // Position horizontally for bottom row
                    player.style.width = `${bottomRowPlayerWidth}px`;
                    player.style.height = `${bottomRowPlayerHeight}px`; // Maintain 16:9 aspect ratio
                }
            }

            // Set dimensions for Player 1 (remaining space in the middle)
            const player1Height = availableHeight - topRowPlayerHeight - bottomRowPlayerHeight; // Remaining height
            const player1Width = (player1Height * 16) / 9; // Maintain 16:9 aspect ratio
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.top = `${topRowPlayerHeight}px`; // Position below the top row
                player1.style.left = `${(availableWidth / 2) - (player1Width / 2)}px`; // Adjust for half of Player 1's width
                player1.style.width = `${Math.min(player1Width, availableWidth)}px`; // Make sure it fits in the available width
                player1.style.height = `${player1Height}px`;
            }
        } else if (numPlayers === 11 && !isHidden) {
            // Similar setup for when the sidebar is visible
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 11
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            const sidebarWidth = window.innerWidth * 0.12;
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableHeight = window.innerHeight;

            const playerWidth = availableWidth / 5;
            const playerHeight = (playerWidth * 9) / 16;
            const shiftAmount = sidebarWidth;

            // Position top row players (Players 2-5)
            for (let i = 1; i < 5; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '0';
                    player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`;
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                }
            }

            // Position Player 1 centered below top row
            const player1Width = availableWidth * 0.5;
            const player1Height = (player1Width * 9) / 16;
            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`;
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`;
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`;

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height;
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`;
                    player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`;
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                }
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            if (player10) {
                player10.style.position = 'absolute';
                player10.style.top = `${playerHeight}px`;
                player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
                player10.style.width = `${playerWidth}px`;
                player10.style.height = `${playerHeight}px`;
            }

            // Position Player 11 directly below Player 3
            const player11 = players[10];
            if (player11) {
                player11.style.position = 'absolute';
                player11.style.top = `${playerHeight * 2}px`; // Align below Player 10
                player11.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
                player11.style.width = `${playerWidth}px`;
                player11.style.height = `${playerHeight}px`;
            }
        }
        if (numPlayers === 12 && isHidden) {
            // Set up Player 1 separately
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 12
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            // Sidebar logic
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarWidth = sidebarVisible ? (window.innerWidth * 0.12) : 0; // 12% sidebar if visible
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableHeight = window.innerHeight;

            // Container setup for other players
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                document.getElementById('playerContainer').appendChild(otherPlayersContainer);
            }
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%';
            otherPlayersContainer.style.height = '100%';
            otherPlayersContainer.style.overflow = 'hidden';

            // Calculate dimensions for top row players (16:9 aspect ratio)
            const topRowPlayerWidth = availableWidth / 5.1; // Space for 5 players
            const topRowPlayerHeight = (topRowPlayerWidth * 9) / 16; // Maintain 16:9 aspect ratio

            // Calculate total width for top row players
            const totalTopRowWidth = topRowPlayerWidth * 5; // 5 players in the top row
            const leftMargin = (availableWidth - totalTopRowWidth) / 2; // Calculate left margin for center alignment

            // Position Players 2-6 (top row)
            for (let i = 1; i < 6; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '0'; // Align top row with the top of the container
                    player.style.left = `${leftMargin + (i - 1) * topRowPlayerWidth}px`; // Position horizontally with margin
                    player.style.width = `${topRowPlayerWidth}px`;
                    player.style.height = `${topRowPlayerHeight}px`;
                }
            }

            // Calculate dimensions for bottom row players (Players 7-11)
            const bottomRowPlayerWidth = availableWidth / 5.1; // Same width as top row
            const bottomRowPlayerHeight = (bottomRowPlayerWidth * 9) / 16; // Maintain 16:9 aspect ratio

            // Position Players 7-11 (Bottom Row)
            const bottomRowTopOffset = availableHeight - bottomRowPlayerHeight; // Align bottom row to the bottom of the container
            for (let i = 6; i < 11; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`;
                    player.style.left = `${(i - 6) * bottomRowPlayerWidth}px`; // Position horizontally for bottom row
                    player.style.width = `${bottomRowPlayerWidth}px`;
                    player.style.height = `${bottomRowPlayerHeight}px`; // Maintain 16:9 aspect ratio
                }
            }

            // Set dimensions for Player 1 (remaining space in the middle)
            const player1Height = availableHeight - topRowPlayerHeight - bottomRowPlayerHeight; // Remaining height
            const player1Width = (player1Height * 16) / 9; // Maintain 16:9 aspect ratio
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.top = `${topRowPlayerHeight}px`; // Position below the top row

                // Calculate the exact left position for Player 1 to be right of Player 12 with a 1px gap
                const player12RightEdge = leftMargin + topRowPlayerWidth; // Right edge of Player 12
                const player1Left = Math.max(player12RightEdge + 1, (availableWidth / 2) - (player1Width / 2));

                player1.style.left = `${player1Left}px`; // Set left position of Player 1
                player1.style.width = `${Math.min(player1Width, availableWidth)}px`; // Make sure it fits in the available width
                player1.style.height = `${player1Height}px`;
            }

            // Position Player 12 directly below Player 2
            const player12 = players[11];
            if (player12) {
                player12.style.position = 'absolute';

                // Calculate the top position for Player 12 based on Player 2
                const player2TopOffset = topRowPlayerHeight; // Position below the top row
                const player2Height = topRowPlayerHeight; // Height of Player 2 (same as top row players)

                player12.style.top = `${player2TopOffset + player2Height}px`; // Align below Player 2
                player12.style.left = `${leftMargin}px`; // Align directly under Player 2 (first player)
                player12.style.width = `${topRowPlayerWidth}px`; // Same width as other players
                player12.style.height = `${player2Height}px`; // Maintain 16:9 aspect ratio
            }
        } else if (numPlayers === 12 && !isHidden) {
            // Similar setup for when the sidebar is visible
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 12
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            const sidebarWidth = window.innerWidth * 0.12;
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableHeight = window.innerHeight;

            const playerWidth = availableWidth / 5;
            const playerHeight = (playerWidth * 9) / 16;
            const shiftAmount = sidebarWidth;

            // Position top row players (Players 2-5)
            for (let i = 1; i < 5; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '0';
                    player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`;
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                }
            }

            // Position Player 1 centered below top row
            const player1Width = availableWidth * 0.5;
            const player1Height = (player1Width * 9) / 16;
            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`;
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`;
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`;

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height;
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`;
                    player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`;
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                }
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            if (player10) {
                player10.style.position = 'absolute';
                player10.style.top = `${playerHeight}px`;
                player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
                player10.style.width = `${playerWidth}px`;
                player10.style.height = `${playerHeight}px`;
            }

            // Position Player 11 directly below Player 3
            const player11 = players[10];
            if (player11) {
                player11.style.position = 'absolute';
                player11.style.top = `${playerHeight * 2}px`; // Align below Player 10
                player11.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
                player11.style.width = `${playerWidth}px`;
                player11.style.height = `${playerHeight}px`;
            }
            // Position Player 12 directly below Player 3
            const player12 = players[11];
            if (player12) {
                player12.style.position = 'absolute';
                player12.style.top = `${playerHeight}px`; // Align below Player 10
                player12.style.left = `${(0) * playerWidth + 6.6*shiftAmount}px`; // Align below Player 2
                player12.style.width = `${playerWidth}px`; // Same width as other players
                player12.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }
        }
        if (numPlayers === 13 && isHidden) {
            // Set up Player 1 separately
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 13
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            // Sidebar logic
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarWidth = sidebarVisible ? (window.innerWidth * 0.12) : 0; // 12% sidebar if visible
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableHeight = window.innerHeight;

            // Container setup for other players
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                document.getElementById('playerContainer').appendChild(otherPlayersContainer);
            }
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%';
            otherPlayersContainer.style.height = '100%';
            otherPlayersContainer.style.overflow = 'hidden';

            // Calculate dimensions for top row players (16:9 aspect ratio)
            const topRowPlayerWidth = availableWidth / 5.1; // Space for 5 players
            const topRowPlayerHeight = (topRowPlayerWidth * 9) / 16; // Maintain 16:9 aspect ratio

            // Calculate total width for top row players
            const totalTopRowWidth = topRowPlayerWidth * 5; // 5 players in the top row
            const leftMargin = (availableWidth - totalTopRowWidth) / 2; // Calculate left margin for center alignment

            // Position Players 2-6 (top row)
            for (let i = 1; i < 6; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '0'; // Align top row with the top of the container
                    player.style.left = `${leftMargin + (i - 1) * topRowPlayerWidth}px`; // Position horizontally with margin
                    player.style.width = `${topRowPlayerWidth}px`;
                    player.style.height = `${topRowPlayerHeight}px`;
                }
            }

            // Calculate dimensions for bottom row players (Players 7-11)
            const bottomRowPlayerWidth = availableWidth / 5.1; // Same width as top row
            const bottomRowPlayerHeight = (bottomRowPlayerWidth * 9) / 16; // Maintain 16:9 aspect ratio

            // Position Players 7-11 (Bottom Row)
            const bottomRowTopOffset = availableHeight - bottomRowPlayerHeight; // Align bottom row to the bottom of the container
            for (let i = 6; i < 11; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`;
                    player.style.left = `${(i - 6) * bottomRowPlayerWidth}px`; // Position horizontally for bottom row
                    player.style.width = `${bottomRowPlayerWidth}px`;
                    player.style.height = `${bottomRowPlayerHeight}px`; // Maintain 16:9 aspect ratio
                }
            }

            // Set dimensions for Player 1 (centered in the middle space)
            const player1Height = availableHeight - topRowPlayerHeight - bottomRowPlayerHeight; // Remaining height
            const player1Width = (player1Height * 16) / 9; // Maintain 16:9 aspect ratio
            if (player1) {
                player1.style.position = 'absolute';
                player1.style.top = `${topRowPlayerHeight}px`; // Position below the top row
                player1.style.left = `${(availableWidth / 2) - (player1Width / 2)}px`; // Center Player 1
                player1.style.width = `${Math.min(player1Width, availableWidth)}px`; // Ensure it fits within available width
                player1.style.height = `${player1Height}px`;
            }

            // Position Player 12 to the left of Player 1 with a 1px gap
            const player12 = players[11];
            if (player12) {
                const player12Left = parseFloat(player1.style.left) - topRowPlayerWidth - 1; // 1px gap to the left of Player 1

                player12.style.position = 'absolute';
                player12.style.top = `${topRowPlayerHeight}px`;
                player12.style.left = `${player12Left}px`;
                player12.style.width = `${topRowPlayerWidth}px`;
                player12.style.height = `${topRowPlayerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 13 to the right of Player 1 with a 1px gap
            const player13 = players[12];
            if (player13) {
                const player13Left = parseFloat(player1.style.left) + player1Width + 1; // 1px gap to the right of Player 1

                player13.style.position = 'absolute';
                player13.style.top = `${topRowPlayerHeight}px`;
                player13.style.left = `${player13Left}px`;
                player13.style.width = `${topRowPlayerWidth}px`;
                player13.style.height = `${topRowPlayerHeight}px`; // Maintain 16:9 aspect ratio
            }
        } else if (numPlayers === 13 && !isHidden) {
            // Similar setup for when the sidebar is visible
            const player1 = document.getElementById('twitch-player-1');
            const players = Array.from({
                length: 13
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));

            const sidebarWidth = window.innerWidth * 0.12;
            const availableWidth = window.innerWidth - sidebarWidth;
            const availableHeight = window.innerHeight;

            const playerWidth = availableWidth / 5;
            const playerHeight = (playerWidth * 9) / 16;
            const shiftAmount = sidebarWidth;

            // Position top row players (Players 2-5)
            for (let i = 1; i < 5; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = '0';
                    player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`;
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                }
            }

            // Position Player 1 centered below top row
            const player1Width = availableWidth * 0.5;
            const player1Height = (player1Width * 9) / 16;
            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`;
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`;
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`;

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height;
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                if (player) {
                    player.style.position = 'absolute';
                    player.style.top = `${bottomRowTopOffset}px`;
                    player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`;
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                }
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            if (player10) {
                player10.style.position = 'absolute';
                player10.style.top = `${playerHeight}px`;
                player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
                player10.style.width = `${playerWidth}px`;
                player10.style.height = `${playerHeight}px`;
            }

            // Position Player 11 directly below Player 3
            const player11 = players[10];
            if (player11) {
                player11.style.position = 'absolute';
                player11.style.top = `${playerHeight * 2}px`; // Align below Player 10
                player11.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
                player11.style.width = `${playerWidth}px`;
                player11.style.height = `${playerHeight}px`;
            }
            // Position Player 12 directly below Player 3
            const player12 = players[11];
            if (player12) {
                player12.style.position = 'absolute';
                player12.style.top = `${playerHeight}px`; // Align below Player 10
                player12.style.left = `${(0) * playerWidth + 6.6*shiftAmount}px`; // Align below Player 2
                player12.style.width = `${playerWidth}px`; // Same width as other players
                player12.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }
            // Position Player 13 directly below Player 12
            const player13 = players[12];
            if (player13) {
                player13.style.position = 'absolute';
                player13.style.top = `${playerHeight * 2}px`; // Align below Player 10
                player13.style.left = `${(0) * playerWidth + 6.6*shiftAmount}px`; // Align below Player 2
                player13.style.width = `${playerWidth}px`; // Same width as other players
                player13.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }
        }
        if (numPlayers >= 14 && isHidden) {
            // placeholder
            const players = Array.from({
                length: numPlayers
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Sidebar adjustments
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth; // Adjusted width without the sidebar

            // Determine optimal grid columns based on available width and number of players
            const columns = Math.ceil(Math.sqrt(numPlayers)); // Optimal columns for roughly square grid
            const rows = Math.ceil(numPlayers / columns); // Calculate rows needed

            // Calculate player dimensions based on 16:9 aspect ratio
            let playerWidth = Math.floor(availableWidth / columns);
            let playerHeight = Math.floor(playerWidth * (9 / 16));

            // Adjust dimensions if total height exceeds viewport
            if (playerHeight * rows > viewportHeight) {
                playerHeight = Math.floor(viewportHeight / rows);
                playerWidth = Math.floor(playerHeight * (16 / 9));
            }

            // Shift all players to account for sidebar
            const shiftAmount = sidebarWidth;

            // Position each player in the grid
            for (let i = 0; i < numPlayers; i++) {
                const player = players[i];
                if (player) {
                    const row = Math.floor(i / columns);
                    const col = i % columns;

                    // Set player position and size
                    player.style.position = 'absolute';
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                    player.style.left = `${col * playerWidth}px`; // Shift by sidebar width
                    player.style.top = `${row * playerHeight}px`;
                }
            }
            // placeholder
        } else if (numPlayers >= 14 && !isHidden) {
            const players = Array.from({
                length: numPlayers
            }, (_, i) => document.getElementById(`twitch-player-${i + 1}`));
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Sidebar adjustments
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarPercentagenew = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0; // 12% if sidebar is visible
            const availableWidth = viewportWidth - sidebarWidth; // Adjusted width without the sidebar
            const sidebarWidthPx = (viewportWidth * sidebarPercentagenew) / 100; // Sidebar width in pixels
            const availableWidthnosidebar = viewportWidth - sidebarWidthPx; // Adjusted width without the sidebar
            // Determine optimal grid columns based on available width and number of players
            const columns = Math.ceil(Math.sqrt(numPlayers)); // Optimal columns for roughly square grid
            const rows = Math.ceil(numPlayers / columns); // Calculate rows needed

            // Calculate player dimensions based on 16:9 aspect ratio
            let playerWidth = Math.floor(availableWidth / columns);
            let playerWidthnosidebar = Math.floor(availableWidthnosidebar / columns);
            let playerHeight = Math.floor(playerWidth * (9 / 16));
            let playerHeightnosidebar = Math.floor(playerWidthnosidebar * (9 / 16));


            // Adjust dimensions if total height exceeds viewport
            if (playerHeight * rows > viewportHeight) {
                playerHeight = Math.floor(viewportHeight / rows);
                playerWidth = Math.floor(playerHeight * (16 / 9));
            }

            // Shift all players to account for sidebar
            const shiftAmount = sidebarWidth;

            // Position each player in the grid
            for (let i = 0; i < numPlayers; i++) {
                const player = players[i];
                if (player) {
                    const row = Math.floor(i / columns);
                    const col = i % columns;

                    // Set player position and size
                    player.style.position = 'absolute';
                    player.style.width = `${playerWidthnosidebar}px`;
                    player.style.height = `${playerHeightnosidebar}px`;
                    player.style.left = `${col * playerWidthnosidebar + sidebarWidthPx}px`; // Using sidebar width in pixels
                    player.style.top = `${row * playerHeightnosidebar}px`;
                }
            }
        }

    });



    let areButtonsVisible = true; // Track visibility state

    // Toggle visibility of all buttons and the floating box

    // Function to handle visibility toggle
    function toggleVisibility() {
        const buttons = [
            toggleSidebarButton,
            hideAllButton
        ];

        // Toggle visibility state
        areButtonsVisible = !areButtonsVisible;

        // Set all buttons to hidden or visible based on the state
        buttons.forEach(button => {
            button.style.display = areButtonsVisible ? 'block' : 'none';
        });


    }

    // Add event listener for keyboard input
    document.addEventListener('keydown', (event) => {
        // Check if the username input is focused
        const usernameInput = document.getElementById('usernameInput');
        if (usernameInput === document.activeElement) {
            return; // Do nothing if the input is focused
        }

        if (event.key.toLowerCase() === 'h') {
            toggleVisibility();
        }
        if (event.key.toLowerCase() === 's') {
            // Simulate click on toggleSidebarButton
            toggleSidebarButton.click(); // This will trigger the click event
        }
    });
    clearAllButton.addEventListener('click', () => {
        usernameInput.value = ''; // Clear the input fieldsss
        player = []; // Clear the player array

        // Remove all Twitch player elements
        const mainContent = document.getElementById('Main_content');
        while (mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild); // Remove each player element
        }

        updateFloatingBox(); // Update the floating box to reflect the changes
    });
    hideButton.addEventListener('click', () => {
        // Toggle floatingBox visibility without hiding the button itself
        if (floatingBox.style.visibility === "hidden") {
            floatingBox.style.visibility = "visible";
            hideButton.textContent = "Hide Box";
        } else {
            floatingBox.style.visibility = "hidden";
            hideButton.textContent = "Show Box";
        }
    });
    const changeKickInput = document.getElementById('change_kick');
    const changeLinkInput = document.getElementById('link');
    const changeTwitchInput = document.getElementById('change_twitch');
    let Fieldbox = ""; // Initialize Fieldbox
    changeTwitchInput.addEventListener('click', () => {
        if (Fieldbox === "twitch") {} else if (Fieldbox !== "twitch") {
            Fieldbox = "twitch"; // Change Fieldbox to "twitch"
            usernameInput.placeholder = "Enter Twitch Username"; // Update placeholder
        }
    });
    changeKickInput.addEventListener('click', () => {
        if (Fieldbox === "kick") {} else if (Fieldbox !== "kick") {
            Fieldbox = "kick"; // Change Fieldbox to "kick"
            usernameInput.placeholder = "Enter Kick Username"; // Update placeholder
        }
    });

    usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const username = usernameInput.value.trim(); // Trimmed input

            if (username) {
                // Check if the sidebar is hidden
                const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;

                if (!sidebarVisible && typeof toggleSidebarButton !== 'undefined') {
                    toggleSidebarButton.dispatchEvent(new Event('click'));

                    // Set a delay before the second click
                    setTimeout(() => {
                        toggleSidebarButton.dispatchEvent(new Event('click'));
                    }, 30); // Adjust the delay time if needed
                }

                // Add the username to the player list
                addUsernameToPlayer(username);

                // Change Fieldbox to 'twitch' and log it
                Fieldbox = "twitch";

                // Change the placeholder of the username input
                usernameInput.placeholder = "Enter Twitch Username"; // Update placeholder
            }
        }
    });

    // Handle OK button click (or Enter press) to add a player
    // Handle OK button click (or Enter press) to add a player
    function addUsernameToPlayer(username) {
        if (username && !player.includes(username)) {
            const index = player.length + 1; // Starting at 1 for user-friendliness
            player.push(username);
            updateFloatingBox(); // Update the floating box content

            // Load Twitch player only for the new player
            loadSingleTwitchPlayer(username, index);

            usernameInput.value = ''; // Clear the input after adding the player

            // Check if the username already exists in the URL before appending
            const currentUrl = new URL(window.location.href);
            const existingUsernames = currentUrl.searchParams.getAll('username'); // Get all existing usernames in the URL

            // Add the username to the URL only if it's not already there
            if (!existingUsernames.includes(username)) {
                currentUrl.searchParams.append('username', username); // Add the username to the URL
                window.history.pushState({}, '', currentUrl.toString()); // Update URL without reloading
            }
        }
    }




    // Create an array to keep track of all player instances
    const players = [];

    // Variable to track the username of the Kick player
    let kickPlayerUsername;
    let isKickMuted = false;
    // Check if the page load type is a reload (using the Performance API)
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        // Clear the URL parameters on page reload
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        // Retrieve URL parameters
        // Function to get title from sidebar based on username
        function getTitleFromSidebar(username) {
            // Wait for elements to be available
            const sidebarItem = Array.from(document.querySelectorAll('#sidebar .sub-item')).find(item => {
                return item.getAttribute('data-title')?.includes("🟢🟢Kick Stream☝️") &&
                    item.querySelector('.username')?.textContent.trim() === username;
            });

            return sidebarItem ? sidebarItem.getAttribute('data-title') : 'Unknown Title';
        }

        // Function to process usernames from URL
        function processUsernames() {
            const urlParams = new URLSearchParams(window.location.search);
            const usernames = urlParams.getAll("username");

            if (usernames.length > 0) {
                usernames.forEach((username) => {
                    const title = getTitleFromSidebar(username);
                    console.log(`Username: ${username}, Title: ${title}`);

                    // Send username and title when calling addUsernameToPlayer
                    addUsernameToPlayer(username, title);
                });
            }
        }

        // Delay execution to allow sidebar to load
        setTimeout(processUsernames, 500); // Adjust delay as needed
    }
    // Retrieve URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get all 'username' parameters from the URL
    const usernames = urlParams.getAll("username");

    // Debug output to verify usernames

    // Example usage: Implement logic for usernames
    if (usernames.length > 0) {
        usernames.forEach(username => {
            // Add your logic for handling usernames here
        });
    }
    // Function to load a single Twitch player
    function loadSingleTwitchPlayer(username, index) {
        const mainContent = document.getElementById('Main_content');
        const playerDivId = `twitch-player-${index}`;
        const existingPlayerDiv = document.getElementById(playerDivId);
        if (existingPlayerDiv) {
            existingPlayerDiv.remove();
        }
        const playerDiv = document.createElement('div');
        playerDiv.id = playerDivId;
        playerDiv.classList.add('player');
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const height16by9 = (viewportWidth / 16) * 9;
        playerDiv.style.width = height16by9 > viewportHeight ? `${(viewportHeight * 16) / 9}px` : '100%';
        playerDiv.style.height = height16by9 > viewportHeight ? `${viewportHeight}px` : `${height16by9}px`;
        mainContent.appendChild(playerDiv);
        adjustPlayerSizes();
        const sidebarItem = Array.from(document.querySelectorAll('#sidebar .sub-item')).find(item => {
            return item.querySelector('.username').textContent.trim() === username;
        });
        const title = sidebarItem ? sidebarItem.getAttribute('data-title') : 'Unknown Title';
        console.log(`Creating player: ${playerDivId} for ${username} with title: ${title}`);
        if (title.includes("🟢🟢Kick Stream☝️") || Fieldbox === "kick") {
            kickPlayerUsername = username;
            const kickIframe = document.createElement('iframe');
            if (playerDiv.id !== 'twitch-player-1') {
                kickIframe.src = `https://player.kick.com/${username}?muted=true`;
                isKickMuted = true;
                playerDiv.setAttribute('data-volume', 'playermuted');
            } else {
                kickIframe.src = `https://player.kick.com/${username}?muted=false`;
                isKickMuted = false;
                playerDiv.setAttribute('data-volume', 'playerunmuted');
            }
            kickIframe.style.width = '100%';
            kickIframe.style.height = '100%';
            kickIframe.frameBorder = '0';
            kickIframe.scrolling = 'no';
            kickIframe.allowFullscreen = true;
            playerDiv.setAttribute('data-platform', 'kick');
            playerDiv.setAttribute('data-username', username);
            playerDiv.appendChild(kickIframe);
            console.log(`Created Kick player for ${username}`);
            let hoverTimer;
            playerDiv.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimer);
                hoverTimer = setTimeout(() => {
                    const hoveredUsername = playerDiv.getAttribute('data-username');
                    console.log(`Hovering over Kick player: ${hoveredUsername}`);

                    const allKickPlayers = document.querySelectorAll('.player[data-platform="kick"]');

                    allKickPlayers.forEach(kickPlayerDiv => {
                        const username = kickPlayerDiv.getAttribute('data-username');
                        if (!username) return;

                        const isHovered = username === hoveredUsername;
                        const desiredVolume = isHovered ? 'playerunmuted' : 'playermuted';
                        const currentVolume = kickPlayerDiv.getAttribute('data-volume');

                        // Only reload if current volume state is different from desired
                        if (currentVolume !== desiredVolume) {
                            const newIframe = document.createElement('iframe');
                            newIframe.src = `https://player.kick.com/${username}?muted=${isHovered ? 'false' : 'true'}`;
                            newIframe.style.width = '100%';
                            newIframe.style.height = '100%';
                            newIframe.frameBorder = '0';
                            newIframe.scrolling = 'no';
                            newIframe.allowFullscreen = true;

                            kickPlayerDiv.innerHTML = '';
                            kickPlayerDiv.appendChild(newIframe);
                            kickPlayerDiv.setAttribute('data-volume', desiredVolume);

                            console.log(`Recreated Kick player for ${username} as ${desiredVolume === 'playerunmuted' ? 'unmuted' : 'muted'}`);
                        } else {
                            console.log(`Kick player for ${username} already ${desiredVolume}, no reload needed.`);
                        }
                    });

                    // Mute other platform players as before
                    players.forEach(otherPlayer => {
                        if (otherPlayer.playerDiv.getAttribute('data-platform') !== 'kick') {
                            otherPlayer.setVolume(0.0);
                            otherPlayer.playerDiv.setAttribute('data-volume', 'playermuted');
                            console.log(`Muted non-Kick player: ${otherPlayer.username}`);
                        }
                    });
                }, 1100);
            });
            playerDiv.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
            });
        } else {
            const playerOptions = {
                width: '100%',
                height: '100%',
                channel: username,
                layout: 'video',
                autoplay: true,
                muted: false
            };
            const player = new Twitch.Player(playerDivId, playerOptions);
            player.username = username;
            player.playerDiv = playerDiv;
            players.push(player);
            playerDiv.setAttribute('data-platform', 'twitch');
            playerDiv.setAttribute('data-username', username);
            if (index === 1) {
                playerDiv.setAttribute('data-volume', 'playerunmuted');
            } else {
                playerDiv.setAttribute('data-volume', 'playermuted');
            }
            player.addEventListener(Twitch.Player.READY, function() {
                if (index !== 1) {
                    player.setVolume(0.0);
                } else {
                    player.setVolume(1.0);
                }
            });
            let hoverOutTimer;
            playerDiv.addEventListener('mouseenter', () => {
                clearTimeout(hoverOutTimer);
                hoverTimer = setTimeout(() => {
                    const hoveredUsername = playerDiv.getAttribute('data-username');
                    const hoveredPlatform = playerDiv.getAttribute('data-platform');

                    if (hoveredPlatform === 'twitch') {
                        console.log(`Hovering over Twitch player: ${hoveredUsername}`);

                        // Mute all Kick players (reload iframe if not muted)
                        const allKickPlayers = document.querySelectorAll('.player[data-platform="kick"]');
                        allKickPlayers.forEach(kickPlayerDiv => {
                            const currentVolume = kickPlayerDiv.getAttribute('data-volume');
                            if (currentVolume !== 'playermuted') {
                                const username = kickPlayerDiv.getAttribute('data-username');
                                const newIframe = document.createElement('iframe');
                                newIframe.src = `https://player.kick.com/${username}?muted=true`;
                                newIframe.style.width = '100%';
                                newIframe.style.height = '100%';
                                newIframe.frameBorder = '0';
                                newIframe.scrolling = 'no';
                                newIframe.allowFullscreen = true;

                                kickPlayerDiv.innerHTML = '';
                                kickPlayerDiv.appendChild(newIframe);
                                kickPlayerDiv.setAttribute('data-volume', 'playermuted');
                                console.log(`Muted Kick player: ${username}`);
                            }
                        });

                        // Mute all other Twitch players, unmute hovered Twitch player
                        players.forEach(otherPlayer => {
                            if (otherPlayer.playerDiv.getAttribute('data-platform') === 'twitch') {
                                if (otherPlayer.username === hoveredUsername) {
                                    otherPlayer.setVolume(1.0);
                                    otherPlayer.playerDiv.setAttribute('data-volume', 'playerunmuted');
                                    console.log(`Unmuted Twitch player: ${otherPlayer.username}`);
                                } else {
                                    otherPlayer.setVolume(0.0);
                                    otherPlayer.playerDiv.setAttribute('data-volume', 'playermuted');
                                    console.log(`Muted Twitch player: ${otherPlayer.username}`);
                                }
                            }
                        });
                    }
                }, 1100);
            });

            playerDiv.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
                hoverOutTimer = setTimeout(() => {});
            });
        }
    }

    function adjustPlayerSizes() {
        const playerContainer = document.getElementById('Main_content');
        const players = Array.from(playerContainer.children); // Get all player divs as an array
        const numPlayers = players.length;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Clear previous styles
        for (let player of players) {
            player.style.width = '';
            player.style.height = '';
            player.style.marginTop = '';
            player.style.paddingTop = ''; // Clear any paddingTop set previously
            player.style.position = ''; // Reset position
        }

        // Set flex properties for the player container
        playerContainer.style.display = 'flex';
        playerContainer.style.flexWrap = 'wrap';
        playerContainer.style.alignItems = 'flex-start'; // Align items at the top
        playerContainer.style.height = `${viewportHeight}px`; // Set height of the container

        if (numPlayers === 1) {
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
            }

            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Full width of the parent
            otherPlayersContainer.style.height = '100%'; // Full height of the parent
            document.body.appendChild(otherPlayersContainer);

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth;

            const shiftRight = sidebarVisible ? sidebarWidth : 0;

            // Set player width to half the available width
            let playerWidth = Math.floor(availableWidth / 2);
            // Calculate player height to maintain 16:9 aspect ratio
            let playerHeight = Math.floor(playerWidth * (9 / 16));

            // If players' total height exceeds available space, adjust to fit vertically
            if (playerHeight > viewportHeight) {
                playerHeight = Math.floor(viewportHeight / 2);
                playerWidth = Math.floor(playerHeight * (16 / 9)); // Recalculate width to maintain 16:9 ratio
            }

            // Calculate top offset to center players vertically
            const topOffset = (viewportHeight - playerHeight) / 2;

            // Position Players 1 ( Centered)
            for (let i = 0; i = 0; i++) {
                players[i].style.position = 'absolute';
                players[i].style.top = `${topOffset}px`; // Centered vertically
                players[i].style.left = `${shiftRight + i * playerWidth}px`; // Centered horizontally
                players[i].style.width = `${viewportWidth}px`; // 50% width of available space
                players[i].style.height = `${viewportHeight}px`; // Maintain 16:9 aspect ratio
            }
        } else if (numPlayers === 2) {
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
            }

            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Full width of the parent
            otherPlayersContainer.style.height = '100%'; // Full height of the parent
            document.body.appendChild(otherPlayersContainer);

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth;

            const shiftRight = sidebarVisible ? sidebarWidth : 0;

            // Set player width to half the available width
            let playerWidth = Math.floor(availableWidth / 2);
            // Calculate player height to maintain 16:9 aspect ratio
            let playerHeight = Math.floor(playerWidth * (9 / 16));

            // If players' total height exceeds available space, adjust to fit vertically
            if (playerHeight > viewportHeight) {
                playerHeight = Math.floor(viewportHeight / 2);
                playerWidth = Math.floor(playerHeight * (16 / 9)); // Recalculate width to maintain 16:9 ratio
            }

            // Calculate top offset to center players vertically
            const topOffset = (viewportHeight - playerHeight) / 2;

            // Position Players 1 and 2 (Horizontally Centered)
            for (let i = 0; i < 2; i++) {
                players[i].style.position = 'absolute';
                players[i].style.top = `${topOffset}px`; // Centered vertically
                players[i].style.left = `${shiftRight + i * playerWidth}px`; // Centered horizontally
                players[i].style.width = `${playerWidth}px`; // 50% width of available space
                players[i].style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }
        } else if (numPlayers === 3) {
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
            }

            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Full width of the parent
            otherPlayersContainer.style.height = '100%'; // Full height of the parent
            document.body.appendChild(otherPlayersContainer);

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth;

            const shiftRight = sidebarVisible ? sidebarWidth : 0;

            // Set player height to half the viewport height to fit two rows
            let playerHeight = Math.floor(viewportHeight / 2);
            // Calculate player width to maintain 16:9 aspect ratio
            let playerWidth = Math.floor(playerHeight * (16 / 9));

            // If players' total width exceeds available space, adjust to fit horizontally
            if (playerWidth > availableWidth / 2) {
                playerWidth = Math.floor(availableWidth / 2);
                playerHeight = Math.floor(playerWidth * (9 / 16)); // Recalculate height to maintain 16:9 ratio
            }

            // Calculate top offset to center players vertically
            const topOffset = (viewportHeight - playerHeight * 2) / 2;

            // Position Players 1 and 2 (Top Row)
            for (let i = 0; i < 2; i++) {
                players[i].style.position = 'absolute';
                players[i].style.top = `${topOffset}px`; // Position at top row
                players[i].style.left = `${shiftRight + i * playerWidth}px`; // Position left and right
                players[i].style.width = `${playerWidth}px`; // Adjusted width
                players[i].style.height = `${playerHeight}px`; // Adjusted height for 16:9
            }

            // Position Player 3 (Bottom Row, Centered)
            const player3 = players[2];
            player3.style.position = 'absolute';
            player3.style.top = `${topOffset + playerHeight}px`; // Offset below first row
            player3.style.left = `${shiftRight + (availableWidth - playerWidth) / 2}px`; // Center Player 3 horizontally
            player3.style.width = `${playerWidth}px`; // Adjusted width
            player3.style.height = `${playerHeight}px`; // Adjusted height for 16:9
        } else if (numPlayers === 4) {
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
            }

            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Full width of the parent
            otherPlayersContainer.style.height = '100%'; // Full height of the parent
            document.body.appendChild(otherPlayersContainer);

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth;

            const shiftRight = sidebarVisible ? sidebarWidth : 0;

            // Set player height to half the viewport height to fit two rows
            const playerHeight = Math.floor(viewportHeight / 2);
            // Calculate player width to maintain 16:9 aspect ratio
            const playerWidth = Math.floor(playerHeight * (16 / 9));

            // If players' total width exceeds available space, adjust to fit horizontally
            const adjustedPlayerWidth = Math.min(playerWidth, availableWidth / 2);

            // Recalculate height to maintain 16:9 aspect ratio with adjusted width
            const adjustedPlayerHeight = Math.floor(adjustedPlayerWidth * (9 / 16));

            // Calculate top offset to center players vertically
            const topOffset = (viewportHeight - adjustedPlayerHeight * 2) / 2;

            // Position Players 1 and 2 (Top Row)
            for (let i = 0; i < 2; i++) {
                players[i].style.position = 'absolute';
                players[i].style.top = `${topOffset}px`; // Position at top row
                players[i].style.left = `${shiftRight + i * adjustedPlayerWidth}px`; // Position left and right
                players[i].style.width = `${adjustedPlayerWidth}px`; // Adjusted width
                players[i].style.height = `${adjustedPlayerHeight}px`; // Adjusted height for 16:9
            }

            // Position Players 3 and 4 (Bottom Row)
            for (let i = 2; i < 4; i++) {
                players[i].style.position = 'absolute';
                players[i].style.top = `${topOffset + adjustedPlayerHeight}px`; // Position in bottom row
                players[i].style.left = `${shiftRight + (i - 2) * adjustedPlayerWidth}px`; // Position left and right
                players[i].style.width = `${adjustedPlayerWidth}px`; // Adjusted width
                players[i].style.height = `${adjustedPlayerHeight}px`; // Adjusted height for 16:9
            }
        } else if (numPlayers === 5) {
            // Create or find the container for players 2-5
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.top = '0';
            otherPlayersContainer.style.right = '0';

            // Adjust height calculation for players 2-5
            const columnPlayersHeight = (viewportHeight - 20) / 4; // Original height
            const adjustedHeight = columnPlayersHeight * 1.01; // Stretching slightly by 1%
            const columnPlayerWidth = (adjustedHeight / 9) * 16;

            // Positioning for Player 1
            players[0].style.position = 'absolute';
            players[0].style.top = '0';
            players[0].style.left = '12%';
            players[0].style.width = '67%';
            players[0].style.height = '100%';

            // Set dimensions for Players 2-5 (right column)
            for (let i = 1; i <= 4; i++) {
                const player = players[i];

                // Adjust player properties
                player.style.width = `${columnPlayerWidth}px`;
                player.style.height = `${adjustedHeight}px`; // Use the adjusted height
                player.style.position = 'absolute';
                player.style.left = '79%';
                player.style.top = `${(i - 1) * adjustedHeight}px`; // Ensure no additional gaps
            }
        } else if (numPlayers === 6) {
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
            }

            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Full width of the parent
            otherPlayersContainer.style.height = '100%'; // Full height of the parent
            document.body.appendChild(otherPlayersContainer);

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12;
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0;
            const availableWidth = viewportWidth - sidebarWidth;

            const shiftRight = sidebarVisible ? sidebarWidth : 0;

            const playerSize = Math.floor(availableWidth / 3);
            let playerHeight = Math.floor(playerSize * (9 / 16));

            if (playerHeight * 2 > viewportHeight) {
                playerHeight = Math.floor(viewportHeight / 2);
                otherPlayersContainer.style.width = `${Math.floor(playerHeight * 16 / 9) * 3}px`;
            }

            // Calculate top offset to center players vertically
            const topOffset = (viewportHeight - playerHeight * 2) / 2;

            // Position Players 1-3 (Top Row)
            for (let i = 0; i < 3; i++) {
                players[i].style.position = 'absolute';
                players[i].style.top = `${topOffset}px`; // Use topOffset to center vertically
                players[i].style.left = `${shiftRight + i * playerSize}px`;
                players[i].style.width = `${playerSize}px`;
                players[i].style.height = `${playerHeight}px`;
            }

            // Position Players 4-6 (Bottom Row)
            for (let i = 3; i < 6; i++) {
                players[i].style.position = 'absolute';
                players[i].style.top = `${topOffset + playerHeight}px`; // Offset below first row
                players[i].style.left = `${shiftRight + (i - 3) * playerSize}px`;
                players[i].style.width = `${playerSize}px`;
                players[i].style.height = `${playerHeight}px`;
            }
        } else if (numPlayers === 7) {
            // Create or find the container for players 2-7
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                document.body.appendChild(otherPlayersContainer); // Append to body if it's created
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.top = '0';
            otherPlayersContainer.style.right = '0';

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = viewportWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = viewportHeight; // Adjust for any margins/padding

            // Calculate height and width for Player 1 maintaining 16:9 aspect ratio
            let player1Height = availableHeight; // Full available height for Player 1
            let player1Width = (player1Height * 16) / 9; // Width based on height (16:9 ratio)

            if (player1Width > availableWidth * 0.67) { // Limit Player 1 to 67% width
                player1Width = availableWidth * 0.67;
                player1Height = (player1Width * 9) / 16; // Adjust height to maintain aspect ratio
            }

            // Set Player 1 position and size
            players[0].style.position = 'absolute';
            players[0].style.top = '0%';
            players[0].style.left = '12%';
            players[0].style.width = `${player1Width}px`;
            players[0].style.height = `${player1Height}px`;

            // Height available for Players 2-4 (right column)
            const rightColumnHeight = availableHeight; // Use the full available height
            const playerColumnWidth = (rightColumnHeight / 3) * (16 / 9); // Maintain 16:9 ratio for width

            // Adjust size and position of Players 2-4 (right column)
            for (let i = 1; i <= 3; i++) {
                const player = players[i];
                player.style.width = `${playerColumnWidth}px`;
                player.style.height = `${(playerColumnWidth * 9) / 16}px`; // Maintain 16:9 ratio
                player.style.position = 'absolute';
                player.style.marginLeft = '1px'; // Add 1px top margin
                player.style.left = `${player1Width + (viewportWidth * 0.12)}px`;
                player.style.top = `${(i - 1) * (playerColumnWidth * 9) / 16}px`; // Position in column
            }

            // Adjust size and position of Players 5-7 (below Player 1)
            // Adjust size and position of Players 5-7 (aligned to the bottom of mainContent)
            const bottomPlayerWidth = player1Width / 3; // Width for Players 5-7
            const bottomPlayerHeight = (bottomPlayerWidth * 9) / 16; // Height for Players 5-7 maintaining 16:9 ratio
            const bottomPosition = availableHeight - bottomPlayerHeight; // Position from the bottom of the viewport

            for (let i = 4; i < 7; i++) {
                const player = players[i];
                player.style.width = `${bottomPlayerWidth}px`;
                player.style.height = `${bottomPlayerHeight}px`; // Maintain 16:9 ratio
                player.style.position = 'absolute';
                player.style.left = `${(availableWidth * 0.135) + ((i - 4) * bottomPlayerWidth)}px`;
                player.style.top = `${player1Height}px`; // Align with the bottom of mainContent
                player.style.marginTop = '1px'; // Add 1px top margin
            }

        } else if (numPlayers === 8) {
            // Create or find the container for players 2-8
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.top = '0';
            otherPlayersContainer.style.right = '0';

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = viewportWidth - sidebarWidth; // Remaining width after accounting for sidebar

            // Height calculation for Players 2-4 in the right column and Players 5-8 below Player 1
            const columnPlayersHeight = (viewportHeight) / 4; // Original height
            const adjustedHeight = columnPlayersHeight; // Stretching slightly by 1%
            const columnPlayerWidth = (adjustedHeight / 9) * 16;

            // Define sizeMultiplier for scaling Player 1
            const sizeMultiplier = 1.0; // Change this value to increase/decrease size (1 = original size, 2 = double, etc.)

            // Calculate height and width for Player 1 maintaining 16:9 aspect ratio
            const baseHeight = (viewportHeight - adjustedHeight); // Space available for Player 1
            let player1Height = baseHeight * sizeMultiplier; // Height with multiplier
            let player1Width = (player1Height * 16) / 9; // Width based on height (16:9 ratio)


            // Set Player 1 position and size
            players[0].style.position = 'absolute';
            players[0].style.top = '0%';
            players[0].style.left = '12%';
            players[0].style.width = `64%`; // Subtract 1px for the right margin
            players[0].style.height = `74%`;

            // Calculate width and height for Players 5-8 (bottom row)
            const scaleFactor = 1.00; // Scale by 5% to make the players a bit bigger
            const playerWidthBottomRow = (player1Width / 3) * scaleFactor; // Slightly bigger width for smaller players
            const playerHeightBottomRow = (playerWidthBottomRow * 9) / 16; // Maintain 16:9 aspect ratio

            // Calculate the right edge of the bottom row (Player 5-8)
            const bottomRowRightEdge = (playerWidthBottomRow * 4) + ((availableWidth - player1Width) / 2);

            // Adjust size and position of Players 2-4 (right column) to align with the right edge of the bottom row
            for (let i = 1; i <= 3; i++) {
                const player = players[i];
                player.style.width = `${columnPlayerWidth}px`;
                player.style.height = `${adjustedHeight}px`; // Use the adjusted height
                player.style.position = 'absolute';

                // Align to the right edge of the bottom row players
                player.style.left = `${bottomRowRightEdge - columnPlayerWidth}px`; // Align with the right edge of bottom row
                player.style.top = `${(i - 1) * adjustedHeight}px`; // Ensure no additional gaps
            }

            // Adjust size and position of Players 5-8 (below Player 1)
            for (let i = 4; i < 8; i++) {
                const player = players[i];

                player.style.width = `${playerWidthBottomRow}px`; // Set new width
                player.style.height = `${playerHeightBottomRow}px`; // Set new height to maintain 16:9 aspect ratio
                player.style.position = 'absolute';

                // Positioning each player across the bottom
                player.style.left = `${(availableWidth - player1Width) / 2 + ((i - 4) * playerWidthBottomRow)}px`;

                // Position below the last player in the column (3 times adjustedHeight)
                player.style.top = `${adjustedHeight * 3}px`; // Positioned below the last player (Player 4)
            }


        } else if (numPlayers === 9) {
            // Create or find the container for players 2-9
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                playerContainer.appendChild(otherPlayersContainer); // Append to the playerContainer
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Ensure full width
            otherPlayersContainer.style.height = '100%'; // Ensure full height
            otherPlayersContainer.style.overflow = 'hidden'; // Prevent overflow

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (window.innerWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = window.innerWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = window.innerHeight; // Use full height

            // Calculate dimensions for players (16:9 aspect ratio)
            const playerWidth = availableWidth / 4 * 0.9; // Reduce width by 10% for smaller video sizes
            const playerHeight = (playerWidth * 9) / 16; // Maintain 16:9 aspect ratio for player height

            // Shift amount for right alignment
            const shiftAmount = sidebarWidth; // Shift by the width of the sidebar

            // Position Players 2-5 (Top Row)
            for (let i = 1; i <= 4; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = '0'; // Align to the top
                player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 1 in the middle (between top and bottom rows)
            const player1 = players[0];
            const player1Width = availableWidth * 0.5; // Player 1 width (50% of the available width)
            const player1Height = (player1Width * 9) / 16; // Maintain 16:9 aspect ratio for Player 1

            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`; // Position Player 1 right after the top row
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`; // Center Player 1 horizontally
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`; // Maintain 16:9 aspect ratio

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height; // Bottom row just below Player 1
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = `${bottomRowTopOffset}px`; // Position right after Player 1 height
                player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }
        } else if (numPlayers === 10) {
            // Create or find the container for players 2-9
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                playerContainer.appendChild(otherPlayersContainer); // Append to the playerContainer
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Ensure full width
            otherPlayersContainer.style.height = '100%'; // Ensure full height
            otherPlayersContainer.style.overflow = 'hidden'; // Prevent overflow

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (window.innerWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = window.innerWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = window.innerHeight; // Use full height

            // Calculate dimensions for players (16:9 aspect ratio)
            const playerWidth = availableWidth / 4 * 0.9; // Reduce width by 10% for smaller video sizes
            const playerHeight = (playerWidth * 9) / 16; // Maintain 16:9 aspect ratio for player height

            // Shift amount for right alignment
            const shiftAmount = sidebarWidth; // Shift by the width of the sidebar

            // Position Players 2-5 (Top Row)
            for (let i = 1; i <= 4; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = '0'; // Align to the top
                player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 1 in the middle (between top and bottom rows)
            const player1 = players[0];
            const player1Width = availableWidth * 0.5; // Player 1 width (50% of the available width)
            const player1Height = (player1Width * 9) / 16; // Maintain 16:9 aspect ratio for Player 1

            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`; // Position Player 1 right after the top row
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`; // Center Player 1 horizontally
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`; // Maintain 16:9 aspect ratio

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height; // Bottom row just below Player 1
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = `${bottomRowTopOffset}px`; // Position right after Player 1 height
                player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            player10.style.position = 'absolute';
            player10.style.top = `${playerHeight}px`; // Align with Player 1's bottom
            player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
            player10.style.width = `${playerWidth}px`; // Same width as other players
            player10.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
        } else if (numPlayers === 11) {
            // Create or find the container for players 2-9
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                playerContainer.appendChild(otherPlayersContainer); // Append to the playerContainer
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Ensure full width
            otherPlayersContainer.style.height = '100%'; // Ensure full height
            otherPlayersContainer.style.overflow = 'hidden'; // Prevent overflow

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (window.innerWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = window.innerWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = window.innerHeight; // Use full height

            // Calculate dimensions for players (16:9 aspect ratio)
            const playerWidth = availableWidth / 4 * 0.9; // Reduce width by 10% for smaller video sizes
            const playerHeight = (playerWidth * 9) / 16; // Maintain 16:9 aspect ratio for player height

            // Shift amount for right alignment
            const shiftAmount = sidebarWidth; // Shift by the width of the sidebar

            // Position Players 2-5 (Top Row)
            for (let i = 1; i <= 4; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = '0'; // Align to the top
                player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 1 in the middle (between top and bottom rows)
            const player1 = players[0];
            const player1Width = availableWidth * 0.5; // Player 1 width (50% of the available width)
            const player1Height = (player1Width * 9) / 16; // Maintain 16:9 aspect ratio for Player 1

            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`; // Position Player 1 right after the top row
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`; // Center Player 1 horizontally
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`; // Maintain 16:9 aspect ratio

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height; // Bottom row just below Player 1
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = `${bottomRowTopOffset}px`; // Position right after Player 1 height
                player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            player10.style.position = 'absolute';
            player10.style.top = `${playerHeight}px`; // Align with Player 1's bottom
            player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
            player10.style.width = `${playerWidth}px`; // Same width as other players
            player10.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            // Position Player 11 directly below Player 10
            const player11 = players[10];
            player11.style.position = 'absolute';
            player11.style.top = `${playerHeight * 2}px`; // Align below Player 10
            player11.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
            player11.style.width = `${playerWidth}px`; // Same width as other players
            player11.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
        } else if (numPlayers === 12) {
            // Create or find the container for players 2-9
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                playerContainer.appendChild(otherPlayersContainer); // Append to the playerContainer
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Ensure full width
            otherPlayersContainer.style.height = '100%'; // Ensure full height
            otherPlayersContainer.style.overflow = 'hidden'; // Prevent overflow

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (window.innerWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = window.innerWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = window.innerHeight; // Use full height

            // Calculate dimensions for players (16:9 aspect ratio)
            const playerWidth = availableWidth / 4 * 0.9; // Reduce width by 10% for smaller video sizes
            const playerHeight = (playerWidth * 9) / 16; // Maintain 16:9 aspect ratio for player height

            // Shift amount for right alignment
            const shiftAmount = sidebarWidth; // Shift by the width of the sidebar

            // Position Players 2-5 (Top Row)
            for (let i = 1; i <= 4; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = '0'; // Align to the top
                player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 1 in the middle (between top and bottom rows)
            const player1 = players[0];
            const player1Width = availableWidth * 0.5; // Player 1 width (50% of the available width)
            const player1Height = (player1Width * 9) / 16; // Maintain 16:9 aspect ratio for Player 1

            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`; // Position Player 1 right after the top row
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`; // Center Player 1 horizontally
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`; // Maintain 16:9 aspect ratio

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height; // Bottom row just below Player 1
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = `${bottomRowTopOffset}px`; // Position right after Player 1 height
                player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            player10.style.position = 'absolute';
            player10.style.top = `${playerHeight}px`; // Align with Player 1's bottom
            player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
            player10.style.width = `${playerWidth}px`; // Same width as other players
            player10.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            // Position Player 11 directly below Player 10
            const player11 = players[10];
            player11.style.position = 'absolute';
            player11.style.top = `${playerHeight * 2}px`; // Align below Player 10
            player11.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
            player11.style.width = `${playerWidth}px`; // Same width as other players
            player11.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            // Position Player 12 directly below Player 5
            const player12 = players[11];
            player12.style.position = 'absolute';
            player12.style.top = `${playerHeight}px`; // Align below Player 10
            player12.style.left = `${(0) * playerWidth + 6.6*shiftAmount}px`; // Align below Player 2
            player12.style.width = `${playerWidth}px`; // Same width as other players
            player12.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
        } else if (numPlayers === 13) {
            // Create or find the container for players 2-9
            let otherPlayersContainer = document.getElementById('other-players-container');
            if (!otherPlayersContainer) {
                otherPlayersContainer = document.createElement('div');
                otherPlayersContainer.id = 'other-players-container';
                otherPlayersContainer.className = 'other-players-container';
                playerContainer.appendChild(otherPlayersContainer); // Append to the playerContainer
            }

            // Ensure the container styles
            otherPlayersContainer.style.display = 'flex';
            otherPlayersContainer.style.flexDirection = 'column';
            otherPlayersContainer.style.position = 'relative';
            otherPlayersContainer.style.width = '100%'; // Ensure full width
            otherPlayersContainer.style.height = '100%'; // Ensure full height
            otherPlayersContainer.style.overflow = 'hidden'; // Prevent overflow

            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (window.innerWidth * sidebarPercentage) / 100 : 0; // Use 0 if sidebar is hidden
            const availableWidth = window.innerWidth - sidebarWidth; // Remaining width after accounting for sidebar
            const availableHeight = window.innerHeight; // Use full height

            // Calculate dimensions for players (16:9 aspect ratio)
            const playerWidth = availableWidth / 4 * 0.9; // Reduce width by 10% for smaller video sizes
            const playerHeight = (playerWidth * 9) / 16; // Maintain 16:9 aspect ratio for player height

            // Shift amount for right alignment
            const shiftAmount = sidebarWidth; // Shift by the width of the sidebar

            // Position Players 2-5 (Top Row)
            for (let i = 1; i <= 4; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = '0'; // Align to the top
                player.style.left = `${(i - 1) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 1 in the middle (between top and bottom rows)
            const player1 = players[0];
            const player1Width = availableWidth * 0.5; // Player 1 width (50% of the available width)
            const player1Height = (player1Width * 9) / 16; // Maintain 16:9 aspect ratio for Player 1

            player1.style.position = 'absolute';
            player1.style.top = `${playerHeight}px`; // Position Player 1 right after the top row
            player1.style.left = `${(availableWidth / 2) - (player1Width / 2) + shiftAmount}px`; // Center Player 1 horizontally
            player1.style.width = `${player1Width}px`;
            player1.style.height = `${player1Height}px`; // Maintain 16:9 aspect ratio

            // Position Players 6-9 (Bottom Row)
            const bottomRowTopOffset = playerHeight + player1Height; // Bottom row just below Player 1
            for (let i = 5; i <= 8; i++) {
                const player = players[i];
                player.style.position = 'absolute';
                player.style.top = `${bottomRowTopOffset}px`; // Position right after Player 1 height
                player.style.left = `${(i - 5) * playerWidth + shiftAmount}px`; // Position horizontally and shift right
                player.style.width = `${playerWidth}px`;
                player.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            }

            // Position Player 10 directly below Player 2
            const player10 = players[9];
            player10.style.position = 'absolute';
            player10.style.top = `${playerHeight}px`; // Align with Player 1's bottom
            player10.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
            player10.style.width = `${playerWidth}px`; // Same width as other players
            player10.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            // Position Player 11 directly below Player 10
            const player11 = players[10];
            player11.style.position = 'absolute';
            player11.style.top = `${playerHeight * 2}px`; // Align below Player 10
            player11.style.left = `${(0) * playerWidth + shiftAmount}px`; // Align below Player 2
            player11.style.width = `${playerWidth}px`; // Same width as other players
            player11.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            // Position Player 12 directly below Player 5
            const player12 = players[11];
            player12.style.position = 'absolute';
            player12.style.top = `${playerHeight}px`; // Align below Player 10
            player12.style.left = `${(0) * playerWidth + 6.6*shiftAmount}px`; // Align below Player 2
            player12.style.width = `${playerWidth}px`; // Same width as other players
            player12.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
            // Position Player 13 directly below Player 5
            const player13 = players[12];
            player13.style.position = 'absolute';
            player13.style.top = `${playerHeight * 2}px`; // Align below Player 10
            player13.style.left = `${(0) * playerWidth + 6.6*shiftAmount}px`; // Align below Player 2
            player13.style.width = `${playerWidth}px`; // Same width as other players
            player13.style.height = `${playerHeight}px`; // Maintain 16:9 aspect ratio
        } else if (numPlayers >= 14) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Sidebar adjustments
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            const sidebarPercentage = 12; // Sidebar takes up 12% when visible
            const sidebarWidth = sidebarVisible ? (viewportWidth * sidebarPercentage) / 100 : 0; // 12% if sidebar is visible
            const availableWidth = viewportWidth - sidebarWidth; // Adjusted width without the sidebar

            // Determine optimal grid columns based on available width and number of players
            const columns = Math.ceil(Math.sqrt(numPlayers)); // Optimal columns for roughly square grid
            const rows = Math.ceil(numPlayers / columns); // Calculate rows needed

            // Calculate player dimensions based on 16:9 aspect ratio
            let playerWidth = Math.floor(availableWidth / columns);
            let playerHeight = Math.floor(playerWidth * (9 / 16));

            // Adjust dimensions if total height exceeds viewport
            if (playerHeight * rows > viewportHeight) {
                playerHeight = Math.floor(viewportHeight / rows);
                playerWidth = Math.floor(playerHeight * (16 / 9));
            }

            // Shift all players to account for sidebar
            const shiftAmount = sidebarWidth;

            // Position each player in the grid
            for (let i = 0; i < numPlayers; i++) {
                const player = players[i];
                if (player) {
                    const row = Math.floor(i / columns);
                    const col = i % columns;

                    // Set player position and size
                    player.style.position = 'absolute';
                    player.style.width = `${playerWidth}px`;
                    player.style.height = `${playerHeight}px`;
                    player.style.left = `${col * playerWidth + shiftAmount}px`; // Shift by sidebar width
                    player.style.top = `${row * playerHeight}px`;
                }
            }
        }

    }

    function createButton(text, onClick, color, id) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.marginLeft = '5px';
        button.style.color = color;
        button.style.fontSize = '10px';
        button.style.padding = '2px 4px';
        button.id = id; // Assign a unique ID for the button
        button.addEventListener('click', onClick);
        return button;
    }

    function removePlayer(index) {
        if (index > -1 && index < player.length) {
            // Remove the Twitch player div from the DOM
            const playerDivId = `twitch-player-${index + 1}`;
            const playerDiv = document.getElementById(playerDivId);

            if (playerDiv) {
                playerDiv.remove();
                console.log(`Deleted Twitch player: ${playerDivId}`);
            }

            // Remove the player from the array
            player.splice(index, 1);

            // Renumber remaining players
            renumberPlayers();

            // Log the number of players left
            console.log(`Number of players left: ${player.length}`);

            // Clear the URL parameters and re-add the remaining usernames with "username=" format
            const urlParams = new URLSearchParams();
            player.forEach(username => {
                urlParams.append('username', username);
            });

            // Update the URL with the new query string
            const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            // Check if only one player is left and handle sidebar toggles
            if (player.length === 1) {
                if (typeof toggleSidebarButton !== 'undefined') {
                    toggleSidebarButton.dispatchEvent(new Event('click'));
                    setTimeout(() => {
                        toggleSidebarButton.dispatchEvent(new Event('click'));
                    }, 100);
                }
            } else {
                // Adjust sizes if not in the special case
                adjustPlayerSizes();
            }

            // Update the floating box to reflect the changes
            updateFloatingBox();

            // Check if the sidebar is hidden and handle additional toggle click
            const sidebarVisible = document.getElementById('sidebar') && document.getElementById('sidebar').offsetWidth > 0;
            if (!sidebarVisible && player.length > 1) {
                if (typeof toggleSidebarButton !== 'undefined') {
                    toggleSidebarButton.dispatchEvent(new Event('click'));
                    setTimeout(() => {
                        toggleSidebarButton.dispatchEvent(new Event('click'));
                    }, 50);
                }
            }
        }
    }


    // New function to renumber players
    function renumberPlayers() {
        const playerContainer = document.getElementById('Main_content');
        const players = Array.from(playerContainer.children); // Get all player divs as an array

        // Renumber player IDs
        players.forEach((playerDiv, index) => {
            const newId = `twitch-player-${index + 1}`;
            playerDiv.id = newId; // Update the ID
            console.log(`Renamed player to: ${newId}`); // Log the renaming for debugging
        });
    }
    // Updated updateFloatingBox function
    function updateFloatingBox() {
        floatingBox.innerHTML = ''; // Clear the floating box content

        player.forEach((username, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `player${index + 1}: ${username}`;

            const playerXButton = createButton('X', () => removePlayer(index), 'red', `player${index + 1}x`);
            playerDiv.appendChild(playerXButton);
            floatingBox.appendChild(playerDiv);

            // Log the player variable to the console
            console.log(`player${index + 1}: ${username}`);
        });

        // Re-add input and buttons
        floatingBox.appendChild(usernameInput); // Add input again
        floatingBox.appendChild(clearAllButton); // Add clear button again
        floatingBox.appendChild(changeTwitchInput); // Add change_twitch button
        floatingBox.appendChild(changeKickInput); // Add change_kick button
        floatingBox.appendChild(changeLinkInput); // Add change_kick button

    }

    function collapseAllSubItems() {
        document.querySelectorAll('.sub-item[data-category]').forEach(subItem => {
            subItem.style.display = 'none';
        });
    }

    function sortCategories() {
        const categories = Array.from(sidebar.getElementsByClassName('category')).sort((a, b) => {
            const numA = parseInt(a.textContent.match(/^\d+/)) || 0;
            const numB = parseInt(b.textContent.match(/^\d+/)) || 0;
            return numA === numB ? a.textContent.localeCompare(b.textContent) : numA - numB;
        });
        categories.forEach(category => {
            sidebar.appendChild(category);
            sortSubItems(category);
        });
    }

    function sortSubItems(category) {
        const subItems = Array.from(document.querySelectorAll(`.sub-item[data-category="${category.dataset.category}"]`)).sort((a, b) => {
            return parseInt(b.dataset.viewers.replace(/,/g, '')) - parseInt(a.dataset.viewers.replace(/,/g, ''));
        });
        subItems.forEach(subItem => {
            sidebar.appendChild(subItem);
        });
        category.textContent = category.textContent.replace(/^\d+/, '').trim();
    }

    function addCategoryClickListeners() {
        document.querySelectorAll('.category[data-category]').forEach(category => {
            category.addEventListener('click', () => {
                toggleSubItems(category.dataset.category);
                highlightCategory(category); // Call highlightCategory without removing highlights
            });
        });
    }

    // Modify the toggleSubItems function
    function toggleSubItems(category) {
        const subItems = document.querySelectorAll(`.sub-item[data-category="${category}"]`);
        const isCollapsed = subItems[0].style.display === 'none'; // Check if the first sub-item is collapsed

        // Collapse all other categories
        document.querySelectorAll('.category[data-category]').forEach(cat => {
            if (cat.dataset.category !== category) {
                const otherSubItems = document.querySelectorAll(`.sub-item[data-category="${cat.dataset.category}"]`);
                otherSubItems.forEach(item => {
                    item.style.display = 'none'; // Collapse other sub-items
                });
                cat.classList.remove('highlight'); // Remove highlight from other categories
            }
        });

        // Expand or collapse the selected category's sub-items
        subItems.forEach(subItem => {
            subItem.style.display = isCollapsed ? 'block' : 'none'; // Toggle display based on current state
        });
    }

    // Update the addCategoryClickListeners function to remove highlight from others
    function addCategoryClickListeners() {
        document.querySelectorAll('.category[data-category]').forEach(category => {
            category.addEventListener('click', () => {
                toggleSubItems(category.dataset.category);
                highlightCategory(category); // Call highlightCategory for the clicked category
            });
        });
    }

    function updateCategoryUserCounts() {
        document.querySelectorAll('.category[data-category]').forEach(category => {
            const uniqueUsernames = new Set();
            const subItems = document.querySelectorAll(`.sub-item[data-category="${category.dataset.category}"]`);
            subItems.forEach(subItem => {
                uniqueUsernames.add(subItem.textContent.trim());
            });
            const userCountElement = document.createElement('span');
            userCountElement.classList.add('user-count');
            userCountElement.textContent = `(${uniqueUsernames.size})`;
            const existingCountElement = category.querySelector('.user-count');
            if (existingCountElement) {
                category.removeChild(existingCountElement);
            }
            category.appendChild(userCountElement);
        });
    }

    // Handle user clicks in sidebar
    sidebar.addEventListener('click', (event) => {
        if (event.target.classList.contains('username')) {
            addUsernameToPlayer(event.target.textContent.trim());
        } else if (event.target.classList.contains('category')) {
            handleCategorySelection(event.target.dataset.category);
        }
    });

    function handleCategorySelection(category) {
        // Remove any existing "All" links
        sidebar.querySelectorAll('.all-link').forEach(link => link.remove());

        // Get the users for the selected category
        const users = Array.from(document.querySelectorAll(`.sub-item[data-category="${category}"] .username`));

        // Create the "All" link
        const allLink = document.createElement('a');
        allLink.href = '#';
        allLink.textContent = 'All';
        allLink.classList.add('all-link');
        allLink.style.cursor = 'pointer';
        allLink.style.color = 'blue';
        allLink.style.fontSize = '1.7rem'; // Adjust font size for the link to avoid overlap
        allLink.style.whiteSpace = 'nowrap'; // Prevent line breaks if text overflows

        // Add click event to the "All" link
        allLink.addEventListener('click', (e) => {
            e.preventDefault();
            addAllUsersToPlayer(users);
        });

        // Find the category element for the selected category
        const categoryElement = document.querySelector(`.category[data-category="${category}"]`);

        // Remove the "highlighted" class and reset the styles for all categories
        document.querySelectorAll('.category').forEach((el) => {
            el.classList.remove('highlighted');
            el.style.fontSize = ''; // Reset font size
            el.style.padding = ''; // Reset padding
        });

        // Add the "highlighted" class and apply styles to the newly selected category
        categoryElement.classList.add('highlighted');
        categoryElement.style.fontSize = '1.3rem'; // Adjust font size for the highlighted category
        categoryElement.style.padding = '5px'; // Adjust padding to make space for the "All" link

        // Append the "All" link to the selected category element
        categoryElement.appendChild(allLink);
    }

    function addAllUsersToPlayer(users) {
        users.forEach(user => {
            addUsernameToPlayer(user.textContent.trim());
        });
    }
});