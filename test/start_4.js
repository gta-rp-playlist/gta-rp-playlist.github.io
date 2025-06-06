// this filename is start_4.js

document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 600) return;

    const sidebar = document.getElementById("sidebar");
    const player = document.getElementById("player");
    const chatIframe = document.getElementById("chat");
    const streamInfo = document.getElementById("streamInfo");
    const usernamesContainer = document.getElementById("usernamesContainer");
    let hideTimeout;

    function hideSidebar(delay) {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!sidebar.matches(":hover")) {
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

    hideSidebar(9000);
});
