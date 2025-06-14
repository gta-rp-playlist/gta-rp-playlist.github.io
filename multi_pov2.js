

document.addEventListener("DOMContentLoaded", function() {
    const players = document.querySelectorAll('.player');
    const sidebar = document.getElementById('sidebar');

    // Declare the fieldbox variable with the starting value
    const fieldbox = "twitch";
    console.log(`Fieldbox: ${fieldbox}`);

    // Check if sidebar is hidden on page load
    const isSidebarHidden = sidebar.classList.contains('hidden') || sidebar.offsetWidth === 0;

    console.log(`Sidebar is ${isSidebarHidden ? 'hidden' : 'visible'} on page load.`);

    // Function to set the unmuted class on the correct player
    function updateUnmutedPlayer(targetPlayer) {
        // Remove .unmuted class from all players
        players.forEach(player => player.classList.remove('unmuted'));

        // Add .unmuted class to the target player
        if (targetPlayer) {
            targetPlayer.classList.add('unmuted');
        }
    }

    // Iterate over each player to set up mute/unmute functionality
    players.forEach(player => {
        const iframe = player.querySelector('iframe');

        // Listen for click events on each player container to toggle mute/unmute
        player.addEventListener('click', function() {
            const isUnmuted = player.classList.contains('unmuted');

            // Toggle mute/unmute based on current state
            iframe.contentWindow.postMessage({
                event: 'command',
                func: isUnmuted ? 'mute' : 'unMute'
            }, '*');

            // Update .unmuted class only for the player being unmuted
            updateUnmutedPlayer(isUnmuted ? null : player);
        });
    });
});
document.getElementById('link').addEventListener('click', function() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Prepare the text with the URL
    const textToCopy = `${currentUrl}`;

    // Create a temporary input element to copy the text to clipboard
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = textToCopy; // Set the value of the input to the text we want to copy

    // Select the text inside the input field
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand('copy');

    // Remove the temporary input field
    document.body.removeChild(tempInput);

    // Optional: Alert the user or show a success message
    alert('Link copied to clipboard: ' + textToCopy);
});