let Fieldbox = "twitch";

window.addEventListener("load", () => {
    // Create modal HTML structure
    const popupModal = document.createElement("div");
    popupModal.id = "popupModal";
    popupModal.className = "modal";
    
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    
    const modalText = document.createElement("p");
    modalText.innerHTML = "Welcome to the new multiview! Simply click usernames in the sidebar to add players. <br> Alternatively, you can also type in the username in the text field. Click the Green K button to switch and enter a kick username.<br>The floating box is moveable.<br>Click the X button to remove a player.<br>Hover over a player to unmute that player and mute all others.<br><br>Hide Sidebar - Hides the sidebar and makes the players bigger. <b>Keyboard Toggle: S</b><br>Hide Box - Hides the floating box. <b>Keyboard Toggle: H</b><br><br><br>Please send feedback if you have any. I'm always trying to make things better and easier.";
    modalText.style.color = "black"; // Set the text color to black
    
    const okButton = document.createElement("button");
    okButton.innerText = "OK";
    okButton.id = "okButton";
    
    modalContent.appendChild(modalText);
    modalContent.appendChild(okButton);
    popupModal.appendChild(modalContent);
    document.body.appendChild(popupModal); // Append the modal to the body

    // Inject CSS styles
    const style = document.createElement("style");
    style.innerHTML = `
        /* Modal container (hidden by default) */
        .modal {
            display: block; /* Show modal by default */
            position: fixed;
            z-index: 1000; /* On top of everything */
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Black background with transparency */
        }

        /* Modal content box - Even Bigger size */
        .modal-content {
            position: relative;
            background-color: white;
            margin: 5% auto; /* Less margin for bigger modal */
            padding: 60px; /* Increased padding for more space */
            border: 1px solid #888;
            width: 80%; /* Increased width */
            max-width: 1000px; /* Increased max-width */
            border-radius: 8px;
        }

        /* OK button styling */
        #okButton {
            background-color: #4CAF50; /* Green background */
            color: white; /* White text */
            padding: 15px 30px; /* Larger button */
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 30px; /* More space above the button */
            font-size: 18px; /* Larger font size */
        }

        #okButton:hover {
            background-color: #45a049; /* Darker green on hover */
        }
    `;
    document.head.appendChild(style); // Add the styles to the document head

    // Close the modal when the OK button is clicked
    okButton.onclick = function() {
        popupModal.style.display = "none";
    };
});

// Declare the function in the global scope
function highlightCategory(clickedCategory) {
    clickedCategory.classList.toggle('highlight'); // Toggle highlight for clicked category
}
