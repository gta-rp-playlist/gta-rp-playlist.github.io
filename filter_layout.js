function adjustLayout(streamCount) {
    const container = document.getElementById('usernamesList');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const aspectRatio = 16 / 9;

    // Reset display properties to flexbox for centering
    container.style.display = 'flex';
    container.style.justifyContent = 'center'; // Center horizontally
    container.style.alignItems = 'center';     // Center vertically
    container.style.height = '100vh';          // Full window height
    container.style.width = '100vw';           // Full window width

    if (streamCount === 1) {
        // Calculate the largest player size while maintaining 16:9 ratio
        let playerWidth = containerWidth;
        let playerHeight = playerWidth / aspectRatio;

        // If height is too large to fit, adjust width accordingly
        if (playerHeight > containerHeight) {
            playerHeight = containerHeight;
            playerWidth = playerHeight * aspectRatio;
        }

        // Apply the calculated size to the player container
        container.style.width = `${playerWidth}px`;
        container.style.height = `${playerHeight}px`;
        container.style.display = 'flex'; // Ensure flexbox is used for centering
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.gridTemplateColumns = 'none'; // Ensure no grid styles are applied
        container.style.gridAutoRows = 'auto'; // Ensure no grid row sizes are applied

    } else if (streamCount === 4) {
        // Handle 2x2 grid for 4 players
        container.style.display = 'grid';
        const columns = 2;
        const rows = 2;

        const columnWidth = containerWidth / columns;
        const rowHeight = columnWidth / aspectRatio;

        const totalHeight = rowHeight * rows;
        if (totalHeight > containerHeight) {
            const adjustedRowHeight = containerHeight / rows;
            const adjustedColumnWidth = adjustedRowHeight * aspectRatio;

            container.style.gridTemplateColumns = `repeat(${columns}, ${adjustedColumnWidth}px)`;
            container.style.gridAutoRows = `${adjustedRowHeight}px`;
        } else {
            container.style.gridTemplateColumns = `repeat(${columns}, ${columnWidth}px)`;
            container.style.gridAutoRows = `${rowHeight}px`;
        }

    } else if (streamCount === 3) {
        // Pyramid layout for 3 players
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 1fr'; // Two columns
        container.style.gridTemplateRows = '1fr 1fr'; // Two rows
        container.style.gridTemplateAreas = `
            "a b"
            "c c"
        `;

        const columnWidth = containerWidth / 2;
        const rowHeight = columnWidth / aspectRatio;

        const totalHeight = rowHeight * 2;
        if (totalHeight > containerHeight) {
            const adjustedRowHeight = containerHeight / 2;
            const adjustedColumnWidth = adjustedRowHeight * aspectRatio;

            container.style.gridTemplateColumns = `repeat(2, ${adjustedColumnWidth}px)`;
            container.style.gridAutoRows = `${adjustedRowHeight}px`;
        } else {
            container.style.gridTemplateColumns = `repeat(2, ${columnWidth}px)`;
            container.style.gridAutoRows = `${rowHeight}px`;
        }

        // Ensure proper placement of players
        const areas = ['player1', 'player2', 'player3'];
        container.querySelectorAll('.player').forEach((player, index) => {
            player.style.gridArea = areas[index];
        });
        
    } else {
        // Default behavior for other stream counts
        container.style.display = 'grid';
        let optimalColumns = 1;
        let optimalRows = streamCount;
        let maxIframeHeight = 0;
        let maxIframeWidth = 0;

        for (let columns = 1; columns <= streamCount; columns++) {
            const rows = Math.ceil(streamCount / columns);
            const columnWidth = containerWidth / columns;
            const rowHeight = columnWidth / aspectRatio;
            const totalHeight = rowHeight * rows;

            if (totalHeight <= containerHeight && rowHeight > maxIframeHeight) {
                optimalColumns = columns;
                optimalRows = rows;
                maxIframeHeight = rowHeight;
                maxIframeWidth = columnWidth;
            }
        }

        container.style.gridTemplateColumns = `repeat(${optimalColumns}, 1fr)`;
        container.style.gridAutoRows = `${maxIframeHeight}px`;
    }
}