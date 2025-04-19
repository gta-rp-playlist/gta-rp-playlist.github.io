let lastFetchedData = ''; // Store the last fetched data
let lastOpenedCategory = null; // Store the last opened category
let lastFetchedData_2 = ''; // Store the last fetched data
let lastOpenedCategory_2 = null; // Store the last opened category

// player.js
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
    
              // Re-expand the last opened category if it exists
              if (lastOpenedCategory) {
                  toggleSubItems(lastOpenedCategory);
                  highlightCurrentStream(); // Highlight the currently playing stream
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
  
            // Re-expand the last opened category if it exists
            if (lastOpenedCategory_2) {
                toggleSubItems(lastOpenedCategory_2);
                highlightCurrentStream(); // Highlight the currently playing stream
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

// Function to hide player by id
function hidePlayer(playerId) {
    const playerDiv = document.getElementById(playerId);
    if (playerDiv) {
        playerDiv.style.display = 'none';
    }
}

// Function to unhide player by id
function unhidePlayer(playerId) {
    const playerDiv = document.getElementById(playerId);
    if (playerDiv) {
        playerDiv.style.display = 'block';
    }
}

// Function to hide all newpage buttons
function hideAllButtons() {
    ['add_screen','newpage-button1', 'newpage-button2', 'newpage-button3', 'newpage-button4', 'newpage-button5', 'newpage-button6', 'newpage-button7', 'newpage-button8', 'newpage-button9'].forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.style.display = 'none';
        }
    });
}

// Function to show button by id
function showButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.style.display = 'block';
    }

    // Additionally show newpage-button2 if usernameplayer1set is true
    if (buttonId === 'newpage-button1' && usernameplayer1set && !usernameplayer2set) {
        const button2 = document.getElementById('newpage-button2');
        if (button2) {
            button2.style.display = 'block';
        }
    }
}

// Function to reset button colors
function resetButtonColors() {
    ['newpage-button1', 'newpage-button2', 'newpage-button3', 'newpage-button4', 'newpage-button5', 'newpage-button6', 'newpage-button7', 'newpage-button8', 'newpage-button9'].forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.style.backgroundColor = '';
        }
    });
}

// Function to resize player by id
function resizePlayer(playerId, width, height, additionalStyles = {}) {
    const playerDiv = document.getElementById(playerId);
    if (playerDiv) {
        playerDiv.style.width = width;
        playerDiv.style.height = height;

        // Apply additional styles if provided
        for (const [key, value] of Object.entries(additionalStyles)) {
            playerDiv.style[key] = value;
        }

        // Adjust iframe or Twitch player size if needed
        const iframe = playerDiv.querySelector('iframe');
        if (iframe) {
            iframe.width = width;
            iframe.height = height;
        } else {
            const twitchPlayer = playerDiv.querySelector('.twitch-player');
            if (twitchPlayer) {
                twitchPlayer.style.width = width;
                twitchPlayer.style.height = height;
            }
        }
    }
}
// Function to move button by id
function moveButton(elementId, positionStyles = {}, additionalStyles = {}) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.position = 'absolute'; // Ensure the position is set to absolute or any specified value
        for (const [key, value] of Object.entries(positionStyles)) {
            element.style[key] = value;
        }
        // Apply additional styles if provided
        for (const [key, value] of Object.entries(additionalStyles)) {
            element.style[key] = value;
        }
    }
}
const playerUsernames = {};  // Object to store usernames for each player
function playStream(streamName) {
    const username = streamName.toLowerCase();
    const specialUsernames = ['buddha', 'omie', 'locco-rp', 'xqc'];
    const isSpecialStream = specialUsernames.includes(username);

    // Determine which player to update based on the current square
    if (square === 0 && username) {
        square = 1;
        resetButtonColors();
        const button = document.getElementById('newpage-button1');
        if (button) {
            button.style.backgroundColor = 'red';
        }
        console.log("Square set to:", square);
    }

    if (username) {
        const playerId = `player${square}`;
        const playerDiv = document.getElementById(playerId);

        if (playerDiv) {
            // Clear previous player content
            playerDiv.innerHTML = '';
            
            // Log the username and store it in the playerUsernames object
            playerUsernames[playerId] = username;
            console.log(`Username for ${playerId}:`, playerUsernames[playerId]);

            // Update the content of the specific username div
            const usernameDivId = `username${square}`;
            const usernameDiv = document.getElementById(usernameDivId);
            if (usernameDiv) {
                usernameDiv.innerHTML = `${username}`;
            }

            // Find the sub-item element for the specified username
            const streamElement = Array.from(document.querySelectorAll('.sub-item')).find(function(item) {
                return item.querySelector('.username').textContent.trim().toLowerCase() === username;
            });

            if (isSpecialStream && streamElement) {
                // Get the stream title
                const title = streamElement.getAttribute('data-title');
            
                // If the title includes "🟢🟢Kick Stream☝️"
                if (title.includes("🟢🟢Kick Stream☝️")) {
                    // Embed Kick stream
                    const kickIframe = document.createElement('iframe');
                    kickIframe.src = `https://player.kick.com/${username}?muted=true&autoplay=true`;
                    kickIframe.width = "1600"; // Default width
                    kickIframe.height = "900"; // Default height
                    kickIframe.frameBorder = "0";
                    kickIframe.allow = "autoplay; fullscreen";
                    if (square === 2) {
                        kickIframe.width = "1344"; // Updated width for Square 2
                        kickIframe.height = "756"; // Updated height for Square 2
                        resizePlayer('player2', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        unhidePlayer('player2'); // Unhide player2
                    }
                    if (square === 3) {
                        kickIframe.width = "1344"; // Updated width for Square 2
                        kickIframe.height = "756"; // Updated height for Square 2
                        resizePlayer('player3', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        unhidePlayer('player3'); // Unhide player3
                    }
                    if (square === 4) {
                        kickIframe.width = "1344"; // Updated width for Square 4
                        kickIframe.height = "756"; // Updated height for Square 4
                        resizePlayer('player4', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        unhidePlayer('player4'); // Unhide player4
                    }
                    if (square === 5) {
                        kickIframe.width = "1344"; // Updated width for Square 5
                        kickIframe.height = "756"; // Updated height for Square 5
                        resizePlayer('player5', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        unhidePlayer('player5'); // Unhide player5
                    }
                    if (square === 6) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player6', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        unhidePlayer('player6'); // Unhide player6
                    }
                    if (square === 7) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player7', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        unhidePlayer('player7'); // Unhide player7
                    }
                    if (square === 8) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player8', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                        unhidePlayer('player8'); // Unhide player8
                    }
                    if (square === 9) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player9', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                        unhidePlayer('player9'); // Unhide player9
                    }

                    if (square === 1 && usernameplayer2set) {
                        kickIframe.width = "1344"; // Updated width if usernameplayer2set is true and square is 1
                        kickIframe.height = "756"; // Updated height if usernameplayer2set is true and square is 1
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '326px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer3set) {
                        kickIframe.width = "1344"; // Updated width if usernameplayer3set is true and square is 1
                        kickIframe.height = "756"; // Updated height if usernameplayer3set is true and square is 1
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer4set) {
                        kickIframe.width = "1344"; // Updated width if usernameplayer3set is true and square is 1
                        kickIframe.height = "756"; // Updated height if usernameplayer3set is true and square is 1
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                    }
                    if (square === 2 && usernameplayer3set) {
                        kickIframe.width = "1344"; // Updated width if usernameplayer3set is true and square is 2
                        kickIframe.height = "756"; // Updated height if usernameplayer3set is true and square is 2
                        resizePlayer('player2', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer4set) {
                        kickIframe.width = "1344"; // Updated width if usernameplayer4set is true and square is 1
                        kickIframe.height = "756"; // Updated height if usernameplayer4set is true and square is 1
                        resizePlayer('player1', '1344px', '756px', { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                    }
                    if (square === 2 && usernameplayer4set) {
                        kickIframe.width = "1344"; // Updated width if usernameplayer4set is true and square is 2
                        kickIframe.height = "756"; // Updated height if usernameplayer4set is true and square is 2
                        resizePlayer('player2', '1344px', '756px', { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                    }
                    if (square === 3 && usernameplayer4set) {
                        kickIframe.width = "1344"; // Updated width if usernameplayer4set is true and square is 3
                        kickIframe.height = "756"; // Updated height if usernameplayer4set is true and square is 3
                        resizePlayer('player3', '1344px', '756px', { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer5set) {
                        kickIframe.width = "1344"; // Updated width for Square 5
                        kickIframe.height = "756"; // Updated height for Square 5
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 2 && usernameplayer5set) {
                        kickIframe.width = "1344"; // Updated width for Square 5
                        kickIframe.height = "756"; // Updated height for Square 5
                        resizePlayer('player2', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 3 && usernameplayer5set) {
                        kickIframe.width = "1344"; // Updated width for Square 5
                        kickIframe.height = "756"; // Updated height for Square 5
                        resizePlayer('player3', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 4 && usernameplayer5set) {
                        kickIframe.width = "1344"; // Updated width for Square 5
                        kickIframe.height = "756"; // Updated height for Square 5
                        resizePlayer('player4', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer6set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player1', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 2 && usernameplayer6set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player2', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 3 && usernameplayer6set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player3', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 4 && usernameplayer6set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player4', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 5 && usernameplayer6set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player5', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 1 && usernameplayer7set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player1', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 2 && usernameplayer7set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player2', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 3 && usernameplayer7set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player3', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 4 && usernameplayer7set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player4', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 5 && usernameplayer7set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player5', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 6 && usernameplayer7set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player6', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 7 && usernameplayer7set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player7', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 1 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player1', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 2 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player2', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 3 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player3', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 4 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player4', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 5 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player5', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 6 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player6', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 7 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player7', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 8 && usernameplayer8set) {
                        kickIframe.width = "1216"; // Updated width for Square 5
                        kickIframe.height = "684"; // Updated height for Square 5
                        resizePlayer('player8', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 1 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player1', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 2 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player2', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 3 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player3', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 4 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player4', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 5 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player5', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 6 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player6', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 7 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player7', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 8 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player8', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 9 && usernameplayer9set) {
                        kickIframe.width = "784"; // Updated width for Square 9
                        kickIframe.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player9', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    playerDiv.appendChild(kickIframe);
                }
            } else {
                // Embed Twitch interactive video
                const script = document.createElement('script');
                script.src = "https://player.twitch.tv/js/embed/v1.js";
                script.addEventListener('load', () => {
                    const options = {
                        channel: username,
                        width: "1600", // Default width
                        height: "900", // Default height
						quality: "chunked",
                        autoplay: true,
                        parent: ["127.0.0.1", "gta-rp-playlist.com"],
                        muted: false
                    };
                    if (square === 2) {
                        options.width = "1344"; // Updated width for Square 2
                        options.height = "756"; // Updated height for Square 2
                        resizePlayer('player2', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        unhidePlayer('player2'); // Unhide player2
                    }
                    if (square === 3) {
                        options.width = "1344"; // Updated width for Square 2
                        options.height = "756"; // Updated height for Square 2
                        resizePlayer('player3', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        unhidePlayer('player3'); // Unhide player3
                    }
                    if (square === 4) {
                        options.width = "1344"; // Updated width for Square 4
                        options.height = "756"; // Updated height for Square 4
                        resizePlayer('player4', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        unhidePlayer('player4'); // Unhide player4
                    }
                    if (square === 5) {
                        options.width = "1344"; // Updated width for Square 5
                        options.height = "756"; // Updated height for Square 5
                        resizePlayer('player5', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        unhidePlayer('player5'); // Unhide player5
                    }
                    if (square === 6) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player6', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        unhidePlayer('player6'); // Unhide player6
                    }
                    if (square === 7) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player7', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        unhidePlayer('player7'); // Unhide player7
                    }
                    if (square === 8) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player8', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                        unhidePlayer('player8'); // Unhide player8
                    }
                    if (square === 9) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player9', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                        unhidePlayer('player9'); // Unhide player9
                    }

                    if (square === 1 && usernameplayer2set) {
                        options.width = "1344"; // Updated width if usernameplayer2set is true and square is 1
                        options.height = "756"; // Updated height if usernameplayer2set is true and square is 1
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '326px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer3set) {
                        options.width = "1344"; // Updated width if usernameplayer3set is true and square is 1
                        options.height = "756"; // Updated height if usernameplayer3set is true and square is 1
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer4set) {
                        options.width = "1344"; // Updated width if usernameplayer3set is true and square is 1
                        options.height = "756"; // Updated height if usernameplayer3set is true and square is 1
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                    }
                    if (square === 2 && usernameplayer3set) {
                        options.width = "1344"; // Updated width if usernameplayer3set is true and square is 2
                        options.height = "756"; // Updated height if usernameplayer3set is true and square is 2
                        resizePlayer('player2', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer4set) {
                        options.width = "1344"; // Updated width if usernameplayer4set is true and square is 1
                        options.height = "756"; // Updated height if usernameplayer4set is true and square is 1
                        resizePlayer('player1', '1344px', '756px', { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                    }
                    if (square === 2 && usernameplayer4set) {
                        options.width = "1344"; // Updated width if usernameplayer4set is true and square is 2
                        options.height = "756"; // Updated height if usernameplayer4set is true and square is 2
                        resizePlayer('player2', '1344px', '756px', { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                    }
                    if (square === 3 && usernameplayer4set) {
                        options.width = "1344"; // Updated width if usernameplayer4set is true and square is 3
                        options.height = "756"; // Updated height if usernameplayer4set is true and square is 3
                        resizePlayer('player3', '1344px', '756px', { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer5set) {
                        options.width = "1344"; // Updated width for Square 5
                        options.height = "756"; // Updated height for Square 5
                        resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 2 && usernameplayer5set) {
                        options.width = "1344"; // Updated width for Square 5
                        options.height = "756"; // Updated height for Square 5
                        resizePlayer('player2', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 3 && usernameplayer5set) {
                        options.width = "1344"; // Updated width for Square 5
                        options.height = "756"; // Updated height for Square 5
                        resizePlayer('player3', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 4 && usernameplayer5set) {
                        options.width = "1344"; // Updated width for Square 5
                        options.height = "756"; // Updated height for Square 5
                        resizePlayer('player4', "1344px", "756px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                    }
                    if (square === 1 && usernameplayer6set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player1', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 2 && usernameplayer6set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player2', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 3 && usernameplayer6set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player3', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 4 && usernameplayer6set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player4', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 5 && usernameplayer6set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player5', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                    }
                    if (square === 1 && usernameplayer7set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player1', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 2 && usernameplayer7set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player2', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 3 && usernameplayer7set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player3', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 4 && usernameplayer7set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player4', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 5 && usernameplayer7set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player5', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 6 && usernameplayer7set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player6', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 7 && usernameplayer7set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player7', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                    }
                    if (square === 1 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player1', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 2 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player2', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 3 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player3', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 4 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player4', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 5 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player5', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 6 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player6', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 7 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player7', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player8', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 8 && usernameplayer8set) {
                        options.width = "1216"; // Updated width for Square 5
                        options.height = "684"; // Updated height for Square 5
                        resizePlayer('player8', "1216px", "684px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '125px'
                        });
                        resizePlayer('player1', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1345px'
                        });
                        resizePlayer('player2', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '226px',
                            left: '1345px'
                        });
                        resizePlayer('player3', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '452px',
                            left: '1345px'
                        });
                        resizePlayer('player4', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '678px',
                            left: '1345px'
                        });
                        resizePlayer('player5', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '940px'
                        });
                        resizePlayer('player6', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '535px'
                        });
                        resizePlayer('player7', "400px", "225px", { // Add additional styles here
                            position: 'absolute',
                            top: '685px',
                            left: '130px'
                        });
                    }
                    if (square === 1 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player1', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 2 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player2', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 3 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player3', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 4 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player4', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 5 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player5', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 6 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player6', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 7 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player7', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 8 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player8', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player9', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }
                    if (square === 9 && usernameplayer9set) {
                        options.width = "784"; // Updated width for Square 9
                        options.height = "441"; // Updated height for Square 9
                        resizePlayer('player1', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '0px'
                        });
                        resizePlayer('player2', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '417px'
                        });
                        resizePlayer('player3', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '834px'
                        });
                        resizePlayer('player4', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '0px',
                            left: '1251px'
                        });
                        resizePlayer('player9', "784px", "441px", { // Add additional styles here
                            position: 'absolute',
                            top: '235px',
                            left: '480px'
                        });
                        resizePlayer('player5', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '0px'
                        });
                        resizePlayer('player6', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '417px'
                        });
                        resizePlayer('player7', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '834px'
                        });
                        resizePlayer('player8', "416px", "234px", { // Add additional styles here
                            position: 'absolute',
                            top: '676px',
                            left: '1251px'
                        });
                    }

                    players[playerId] = new Twitch.Player(playerId, options);
                    console.log("Twitch player created with ID:", playerId);
                });
                playerDiv.appendChild(script);
            }
        }
        // Mark the username as set for the specific player and log the change
        if (!window[`usernameplayer${square}set`]) {
            window[`usernameplayer${square}set`] = true;
            console.log(`usernameplayer${square}set changed to true`);
            showButton(`newpage-button${square}`);
        }

        // Show newpage-button2 if usernameplayer1set is true and usernameplayer2set is false
        if (square === 1 && usernameplayer1set && !usernameplayer2set) {
            showButton('newpage-button2');
            showButton('add_screen');
        }
        // Show newpage-button3 if usernameplayer1set is true and usernameplayer2set is true
        if (square === 2 && usernameplayer1set && usernameplayer2set && !usernameplayer3set) {
            showButton('newpage-button3');
            moveButton('username1', {
                top: '760px',
                left: '35px'
            });
            moveButton('newpage-button1', {
                top: '760px',
                left: '5px'
            });
            moveButton('newpage-button2', {
                top: '790px',
                left: '5px'
            });
            moveButton('add_screen', {
                top: '880px',
                left: '185px'
            });
        }
        // Show newpage-button4 if usernameplayer1set is true and usernameplayer2set is true
        if (square === 3 && usernameplayer1set && usernameplayer2set && usernameplayer3set && !usernameplayer4set) {
            showButton('newpage-button4');
            moveButton('newpage-button3', {
                top: '820px',
                left: '5px'
            });
        }
        // Show newpage-button5 if usernameplayer1set is true and usernameplayer2set is true
        if (square === 4 && usernameplayer1set && usernameplayer2set && usernameplayer3set && usernameplayer4set && !usernameplayer5set) {
            showButton('newpage-button5');
            moveButton('newpage-button4', {
                top: '850px',
                left: '5px'
            });
        }
        // Show newpage-button6 if usernameplayer1set is true and usernameplayer2set is true
        if (square === 5 && usernameplayer1set && usernameplayer2set && usernameplayer3set && usernameplayer4set && usernameplayer5set && !usernameplayer6set) {
            showButton('newpage-button6');
            moveButton('newpage-button5', {
                top: '880px',
                left: '5px'
            });
        }
        // Show newpage-button7 if usernameplayer1set is true and usernameplayer2set is true
        if (square === 6 && usernameplayer1set && usernameplayer2set && usernameplayer3set && usernameplayer4set && usernameplayer5set && usernameplayer6set && !usernameplayer7set) {
            showButton('newpage-button7');
            moveButton('newpage-button1', {
                top: '730px',
                left: '5px'
            });
            moveButton('newpage-button2', {
                top: '760px',
                left: '5px'
            });
            moveButton('newpage-button3', {
                top: '790px',
                left: '5px'
            });
            moveButton('newpage-button4', {
                top: '820px',
                left: '5px'
            });
            moveButton('newpage-button5', {
                top: '850px',
                left: '5px'
            });
            moveButton('newpage-button6', {
                top: '880px',
                left: '5px'
            });
            moveButton('username1', {
                top: '730px',
                left: '35px'
            });
            moveButton('username2', {
                top: '760px',
                left: '35px'
            });
            moveButton('username3', {
                top: '790px',
                left: '35px'
            });
            moveButton('username4', {
                top: '820px',
                left: '35px'
            });
            moveButton('username5', {
                top: '850px',
                left: '35px'
            });
            moveButton('username6', {
                top: '880px',
                left: '35px'
            });
        }
        // Show newpage-button7 if usernameplayer1set is true and usernameplayer2set is true
        if (square === 7 && usernameplayer1set && usernameplayer2set && usernameplayer3set && usernameplayer4set && usernameplayer5set && usernameplayer6set && usernameplayer7set && !usernameplayer8set) {
            showButton('newpage-button8');
            moveButton('newpage-button1', {
                top: '700px',
                left: '5px'
            });
            moveButton('newpage-button2', {
                top: '730px',
                left: '5px'
            });
            moveButton('newpage-button3', {
                top: '760px',
                left: '5px'
            });
            moveButton('newpage-button4', {
                top: '790px',
                left: '5px'
            });
            moveButton('newpage-button5', {
                top: '820px',
                left: '5px'
            });
            moveButton('newpage-button6', {
                top: '850px',
                left: '5px'
            });
            moveButton('newpage-button7', {
                top: '880px',
                left: '5px'
            });
            moveButton('username1', {
                top: '700px',
                left: '35px'
            });
            moveButton('username2', {
                top: '730px',
                left: '35px'
            });
            moveButton('username3', {
                top: '760px',
                left: '35px'
            });
            moveButton('username4', {
                top: '790px',
                left: '35px'
            });
            moveButton('username5', {
                top: '820px',
                left: '35px'
            });
            moveButton('username6', {
                top: '850px',
                left: '35px'
            });
            moveButton('username7', {
                top: '880px',
                left: '35px'
            });
        }
        // Show newpage-button7 if usernameplayer1set is true and usernameplayer2set is true
        if (square === 8 && usernameplayer1set && usernameplayer2set && usernameplayer3set && usernameplayer4set && usernameplayer5set && usernameplayer6set && usernameplayer7set && usernameplayer8set) {
            showButton('newpage-button9');
            moveButton('newpage-button1', {
                top: '670px',
                left: '5px'
            });
            moveButton('newpage-button2', {
                top: '700px',
                left: '5px'
            });
            moveButton('newpage-button3', {
                top: '730px',
                left: '5px'
            });
            moveButton('newpage-button4', {
                top: '760px',
                left: '5px'
            });
            moveButton('newpage-button5', {
                top: '790px',
                left: '5px'
            });
            moveButton('newpage-button6', {
                top: '820px',
                left: '5px'
            });
            moveButton('newpage-button7', {
                top: '850px',
                left: '5px'
            });
            moveButton('newpage-button8', {
                top: '880px',
                left: '5px'
            });
            moveButton('add_screen', {
                top: '550px',
                left: '0px'
            });
            moveButton('newpage-button9', {
                top: '580px',
                left: '40px'
            });
            moveButton('username1', {
                top: '670px',
                left: '35px'
            });
            moveButton('username2', {
                top: '700px',
                left: '35px'
            });
            moveButton('username3', {
                top: '730px',
                left: '35px'
            });
            moveButton('username4', {
                top: '760px',
                left: '35px'
            });
            moveButton('username5', {
                top: '790px',
                left: '35px'
            });
            moveButton('username6', {
                top: '820px',
                left: '35px'
            });
            moveButton('username7', {
                top: '850px',
                left: '35px'
            });
            moveButton('username8', {
                top: '880px',
                left: '35px'
            });
        }
        if (square === 9 && usernameplayer1set && usernameplayer2set && usernameplayer3set && usernameplayer4set && usernameplayer5set && usernameplayer6set && usernameplayer7set && usernameplayer8set && usernameplayer9set) {
            moveButton('newpage-button1', {
                top: '275px',
                left: '40px'
            });
            moveButton('newpage-button2', {
                top: '310px',
                left: '40px'
            });
            moveButton('newpage-button3', {
                top: '345px',
                left: '40px'
            });
            moveButton('newpage-button4', {
                top: '380px',
                left: '40px'
            });
            moveButton('newpage-button5', {
                top: '415px',
                left: '40px'
            });
            moveButton('newpage-button6', {
                top: '450px',
                left: '40px'
            });
            moveButton('newpage-button7', {
                top: '485px',
                left: '40px'
            });
            moveButton('newpage-button8', {
                top: '520px',
                left: '40px'
            });
            moveButton('add_screen', {
                top: '570px',
                left: '0px'
            });
            moveButton('newpage-button9', {
                top: '555px',
                left: '40px'
            });
            moveButton('username1', {
                top: '280px',
                left: '80px'
            });
            moveButton('username2', {
                top: '315px',
                left: '80px'
            });
            moveButton('username3', {
                top: '350px',
                left: '80px'
            });
            moveButton('username4', {
                top: '385px',
                left: '80px'
            });
            moveButton('username5', {
                top: '420px',
                left: '80px'
            });
            moveButton('username6', {
                top: '455px',
                left: '80px'
            });
            moveButton('username7', {
                top: '490px',
                left: '80px'
            });
            moveButton('username8', {
                top: '525px',
                left: '80px'
            });
            moveButton('username9', {
                top: '560px',
                left: '80px'
            });
            const addScreenElement = document.getElementById('add_screen');
            if (addScreenElement) {
                addScreenElement.style.display = 'none';
            }
        }
    }

    console.log("Clicked:", username);
}
// sidebar.js
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); // Prevent the default scroll behavior for all arrow keys
    }
});
// Function to collapse all sub-items
function collapseAllSubItems() {
    const subItems = document.querySelectorAll('.sub-item[data-category]');
    subItems.forEach(subItem => {
        subItem.style.display = 'none';
    });
}

// Function to update the category title with the number of users
function updateCategoryTitle(containerId, titleSelector) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error('Container not found');
        return;
    }

    // Count the number of users in the container
    const numberOfUsers = container.querySelectorAll('div').length;

    // Find the title element
    const titleElement = container.querySelector(titleSelector);
    
    if (titleElement) {
        // Get the current title text and update it
        const currentTitle = titleElement.textContent.split(' (')[0];
        titleElement.textContent = `${currentTitle} (${numberOfUsers})`;
    } else {
        console.error('Title element not found');
    }
}
function toggleSubItems(category) {
    var categoryName = category.replace(/^\d+/, '');
    var subItems = document.querySelectorAll('.sub-item[data-category]');
    var clickedSubItems = document.querySelectorAll('.sub-item[data-category="' + category + '"]');
    var isExpanded = clickedSubItems[0].style.display === 'block';
    collapseAllSubItems();
    
    if (!isExpanded) {
        // Filter out duplicates based on the username
        var uniqueSubItems = Array.from(clickedSubItems).filter(function(subItem, index, self) {
            var username = subItem.querySelector('.username').textContent.trim().toLowerCase();
            return index === self.findIndex(function(s) {
                return s.querySelector('.username').textContent.trim().toLowerCase() === username;
            });
        });

        uniqueSubItems.forEach(function(subItem) {
            subItem.style.display = 'block';
        });

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
            viewerCount.textContent = '🔴' + subItem.getAttribute('data-viewers');
            usernameContainer.appendChild(viewerCount); // Append viewer count first
            usernameContainer.appendChild(username); // Then append username
            usernameContainer.appendChild(title);
            username.style.cursor = 'pointer';
            username.style.fontSize = '20px';
            username.style.color = 'purple';
            username.classList.add('username-bubble');
            title.style.fontSize = '18px';
            title.style.color = 'white';
            viewerCount.style.fontSize = '12px';
            viewerCount.style.color = 'white';
            viewerCount.style.position = 'relative'; // Enable positioning
            viewerCount.style.top = '-11px'; // Move it up slightly
            viewerCount.style.paddingRight = '10px'; // Move it up slightly
            username.addEventListener('click', function() {
                playStream(streamName);
            });
            usernamesList.appendChild(usernameContainer);
        });

        // Update the category title with the number of users
        var numberOfUsers = uniqueSubItems.length;
        groupTitle.textContent = `${categoryName.trim()} (${numberOfUsers})`;
    }
}

// Function to sort categories and their sub-items
function sortCategories() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
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
            const subItems = document.querySelectorAll(`.sub-item[data-category="${category.dataset.category}"]`);
            const sortedSubItems = Array.from(subItems).sort((a, b) => {
                const viewersA = parseInt(a.dataset.viewers.replace(/,/g, '')) || 0;
                const viewersB = parseInt(b.dataset.viewers.replace(/,/g, '')) || 0;
                return viewersB - viewersA;
            });

            sortedSubItems.forEach(subItem => {
                sidebar.appendChild(subItem);
            });
        });

        categories.forEach(category => {
            category.textContent = category.textContent.replace(/^\d+/, '').trim();
        });
    }
}
function highlightCategory(category) {
    var categories = document.getElementsByClassName('category');
    for (var i = 0; i < categories.length; i++) {
        categories[i].classList.remove('highlighted');
    }
    category.classList.add('highlighted');
}
// main.js
var firstplayer_string = '';
var square = 0; // Declare square in a scope accessible to all functions

// Variables to track if usernames are set for each player
var usernameplayer1set = false;
var usernameplayer2set = false;
var usernameplayer3set = false;
var usernameplayer4set = false;
var usernameplayer5set = false;
var usernameplayer6set = false;
var usernameplayer7set = false;
var usernameplayer8set = false;
var usernameplayer9set = false;
var players = {};
window.onload = function() {
    fetchAndUpdateSidebar();
    fetchAndUpdateNumbers(); // Fetch the numbers on page load
    // Re-fetch the file and update the sidebar every 60 seconds (adjust as needed)
    setInterval(fetchAndUpdateSidebar_none, 120000); // 30,000ms = .5 minute
    setInterval(fetchAndUpdateNumbers, 120000); // 30,000ms = 30 seconds
    // Initialize variables on page load
    usernameplayer1set = false;
    usernameplayer2set = false;
    usernameplayer3set = false;
    usernameplayer4set = false;
    usernameplayer5set = false;
    usernameplayer6set = false;
    usernameplayer7set = false;
    usernameplayer8set = false;
    usernameplayer9set = false;

    // Hide player2, player3, player4 initially
    hidePlayer('player2');
    hidePlayer('player3');
    hidePlayer('player4');
    hidePlayer('player5');
    hidePlayer('player6');
    hidePlayer('player7');
    hidePlayer('player8');
    hidePlayer('player9');

    // Hide all buttons initially
    hideAllButtons();

    sortCategories();
    console.log("Square set to:", square);
    
    // Ensure at least one category is available to avoid errors
    const firstCategory = document.querySelector('.category');
    if (firstCategory) {
        toggleSubItems(firstCategory.dataset.category);

        // Get the first user in the expanded first category and play the stream
        var firstStreamName = document.querySelector('.sub-item[data-category="' + firstCategory.dataset.category + '"] .username').textContent.trim().toLowerCase();
        playStream(firstStreamName);
    }

    // Add event listeners for the newpage buttons
    ['newpage-button1', 'newpage-button2', 'newpage-button3', 'newpage-button4', 'newpage-button5', 'newpage-button6', 'newpage-button7', 'newpage-button8', 'newpage-button9'].forEach((id, index) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', function() {
                square = index + 1;
                const playerId = `player${square}`;
                console.log("playerId set to:", playerId);
                console.log("Square set to:", square);
                resetButtonColors();
                this.style.backgroundColor = 'red';
                // Set the volume for the corresponding player and mute the others
                setPlayerVolume(`player${square}`, 1.0);
                muteAllPlayers(`player${square}`);
                // Show or resize the corresponding player based on the current square value
                if (square === 1 && usernameplayer2set && !usernameplayer3set) {
                    resizePlayer('player1', "1344px", "756px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && !usernameplayer3set) {
                    resizePlayer('player2', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && !usernameplayer2set) {
                    resizePlayer('player1', '1600px', '900px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && !usernameplayer3set) {
                    resizePlayer('player3', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player3'); // Unhide player3 when newpage-button3 is clicked
                }
                if (square === 1 && usernameplayer3set && !usernameplayer4set) {
                    resizePlayer('player1', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && usernameplayer3set && !usernameplayer4set) {
                    resizePlayer('player2', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && usernameplayer3set && !usernameplayer4set) {
                    resizePlayer('player3', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 1 && usernameplayer4set && !usernameplayer5set) {
                    resizePlayer('player1', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && usernameplayer4set && !usernameplayer5set) {
                    resizePlayer('player2', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && usernameplayer4set && !usernameplayer5set) {
                    resizePlayer('player3', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 4 && usernameplayer4set && !usernameplayer5set) {
                    resizePlayer('player4', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 1 && usernameplayer5set && !usernameplayer6set) {
                    resizePlayer('player1', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && usernameplayer5set && !usernameplayer6set) {
                    resizePlayer('player2', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && usernameplayer5set && !usernameplayer6set) {
                    resizePlayer('player3', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 4 && usernameplayer5set && !usernameplayer6set) {
                    resizePlayer('player4', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 5 && usernameplayer5set && !usernameplayer6set) {
                    resizePlayer('player5', '1344px', '756px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 1 && usernameplayer6set && !usernameplayer7set) {
                    resizePlayer('player1', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && usernameplayer6set && !usernameplayer7set) {
                    resizePlayer('player2', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && usernameplayer6set && !usernameplayer7set) {
                    resizePlayer('player3', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 4 && usernameplayer6set && !usernameplayer7set) {
                    resizePlayer('player4', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 5 && usernameplayer6set && !usernameplayer7set) {
                    resizePlayer('player5', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 6 && usernameplayer6set && !usernameplayer7set) {
                    resizePlayer('player6', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 1 && usernameplayer7set && !usernameplayer8set) {
                    resizePlayer('player1', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && usernameplayer7set && !usernameplayer8set) {
                    resizePlayer('player2', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && usernameplayer7set && !usernameplayer8set) {
                    resizePlayer('player3', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 4 && usernameplayer7set && !usernameplayer8set) {
                    resizePlayer('player4', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 5 && usernameplayer7set && !usernameplayer8set) {
                    resizePlayer('player5', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 6 && usernameplayer7set && !usernameplayer8set) {
                    resizePlayer('player6', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 7 && usernameplayer7set && !usernameplayer8set) {
                    resizePlayer('player7', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 1 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player1', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player8', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player2', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player8', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player3', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player8', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 4 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player4', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player8', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 5 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player5', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player8', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 6 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player6', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player8', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 7 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player7', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player8', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 8 && usernameplayer8set && !usernameplayer9set) {
                    resizePlayer('player8', '1216px', '684px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '125px'
                    });
                    resizePlayer('player1', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1345px'
                    });
                    resizePlayer('player2', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '226px',
                        left: '1345px'
                    });
                    resizePlayer('player3', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '452px',
                        left: '1345px'
                    });
                    resizePlayer('player4', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '678px',
                        left: '1345px'
                    });
                    resizePlayer('player5', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '940px'
                    });
                    resizePlayer('player6', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '535px'
                    });
                    resizePlayer('player7', "400px", "225px", { // Add additional styles here
                        position: 'absolute',
                        top: '685px',
                        left: '130px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 1 && usernameplayer9set) {
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player1', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player2', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player3', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 4 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player4', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 5 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player5', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 6 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player6', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 7 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player7', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 8 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player8', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player9', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 9 && usernameplayer9set) {
                    resizePlayer('player1', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '417px'
                    });
                    resizePlayer('player3', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '834px'
                    });
                    resizePlayer('player4', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '1251px'
                    });
                    resizePlayer('player9', "784px", "441px", { // Add additional styles here
                        position: 'absolute',
                        top: '235px',
                        left: '480px'
                    });
                    resizePlayer('player5', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '0px'
                    });
                    resizePlayer('player6', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '417px'
                    });
                    resizePlayer('player7', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '834px'
                    });
                    resizePlayer('player8', "416px", "234px", { // Add additional styles here
                        position: 'absolute',
                        top: '676px',
                        left: '1251px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 1 && !usernameplayer2set) {
                    resizePlayer('player1', '1600px', '900px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', '1px', '1px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 2 && !usernameplayer2set) {
                    resizePlayer('player1', '1600px', '900px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    resizePlayer('player2', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player2'); // Unhide player2 when newpage-button2 is clicked
                }
                if (square === 3 && !usernameplayer3set) {
                    resizePlayer('player3', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player3'); // Unhide player3 when newpage-button3 is clicked
                }
                if (square === 4 && !usernameplayer4set) {
                    resizePlayer('player4', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player4'); // Unhide player4 when newpage-button4 is clicked
                }
                if (square === 5 && !usernameplayer5set) {
                    resizePlayer('player5', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player5'); // Unhide player5 when newpage-button5 is clicked
                
                    // Hide the controls div
                    const controlsDiv = document.getElementById('controls');
                    if (controlsDiv) {
                        controlsDiv.style.display = 'none';
                    }
                }
                if (square === 6 && !usernameplayer6set) {
                    resizePlayer('player6', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player6'); // Unhide player4 when newpage-button4 is clicked
                }
                if (square === 7 && !usernameplayer7set) {
                    resizePlayer('player7', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player7'); // Unhide player4 when newpage-button4 is clicked
                }
                if (square === 8 && !usernameplayer8set) {
                    resizePlayer('player8', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player8'); // Unhide player4 when newpage-button4 is clicked
                }
                if (square === 9 && !usernameplayer9set) {
                    resizePlayer('player9', '6px', '4px', { // Add additional styles here
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });
                    unhidePlayer('player9'); // Unhide player4 when newpage-button4 is clicked
                }
            });
        }
    });
    // Event listener for clicking on categories in the sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('category')) {
                toggleSubItems(target.dataset.category);
            }
        });
    }
    // Add event listener for left arrow key
        // Add event listener for left arrow key
    function getCustomNavigationOrder() {
        if (usernameplayer9set) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
            // Default order if custom conditions are not met
            let order = [];
            for (let i = 1; i <= 9; i++) {
                order.push(i);
            }
            return order;
        }
    }
    
    // Function to get the highest visible button number
    function getHighestVisibleButton() {
        for (let i = 9; i >= 1; i--) {
            const button = document.getElementById(`newpage-button${i}`);
            if (button && button.style.display !== 'none') {
                return i;
            }
        }
        return 0; // No visible buttons
    }
    
    // Function to check if navigation is allowed to a specific button
    function isNavigationAllowed(square) {
        return window[`usernameplayer${square}set`] === true;
    }
    
    // Add event listener for arrow keys
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            if (square > 1) {
                const customOrder = getCustomNavigationOrder();
                let previousSquareIndex = customOrder.indexOf(square) - 1;
                if (previousSquareIndex >= 0) {
                    const previousSquare = customOrder[previousSquareIndex];
                    if (isNavigationAllowed(previousSquare)) {
                        const previousButtonId = `newpage-button${previousSquare}`;
                        const previousButton = document.getElementById(previousButtonId);
                        if (previousButton && previousButton.style.display !== 'none') {
                            previousButton.click();
                            square = previousSquare; // Update square to previous square
                        }
                    }
                }
            }
        } else if (event.key === 'ArrowRight') {
            const customOrder = getCustomNavigationOrder();
            const highestVisibleButton = getHighestVisibleButton();
            const targetSquareIndex = customOrder.indexOf(square) + 1;
            let targetSquare = null;
            
            // Find the next allowed square in the custom order
            while (targetSquareIndex < customOrder.length) {
                targetSquare = customOrder[targetSquareIndex];
                if (targetSquare > highestVisibleButton || !isNavigationAllowed(targetSquare)) {
                    targetSquareIndex++;
                } else {
                    break;
                }
            }
    
            if (targetSquare !== null) {
                const nextButtonId = `newpage-button${targetSquare}`;
                const nextButton = document.getElementById(nextButtonId);
                if (nextButton && nextButton.style.display !== 'none') {
                    nextButton.click();
                    square = targetSquare; // Update square to next square
                }
            }
        } else if (event.key === 'a') { // Use 'A' key to force-click the next not-allowed button
            const customOrder = getCustomNavigationOrder();
            const highestVisibleButton = getHighestVisibleButton();
            let targetSquareIndex = customOrder.indexOf(square) + 1;
            let targetSquare = null;
    
            // Find the next not-allowed square in the custom order
            while (targetSquareIndex < customOrder.length) {
                targetSquare = customOrder[targetSquareIndex];
                if (targetSquare > highestVisibleButton || isNavigationAllowed(targetSquare)) {
                    targetSquareIndex++;
                } else {
                    break;
                }
            }
    
            if (targetSquare !== null) {
                const nextButtonId = `newpage-button${targetSquare}`;
                const nextButton = document.getElementById(nextButtonId);
                if (nextButton && nextButton.style.display !== 'none') {
                    nextButton.click();
                    square = targetSquare; // Update square to the next not-allowed square
                }
            }
        }
    });
};
function setPlayerVolume(playerId, volume) {
    if (players[playerId]) {
        players[playerId].setVolume(volume);
    }
}

function muteAllPlayers(exceptPlayerId) {
    ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8', 'player9'].forEach(playerId => {
        if (playerId !== exceptPlayerId) {
            setPlayerVolume(playerId, 0.0);
        }
    });
}
