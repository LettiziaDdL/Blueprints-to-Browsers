/*
    Author: Lettizia Diaz de Leon
    Date: November 4, 2026
    Purpose: Runs the Network Connection Test page. Detects whether the site is
             running on a local server, a hosted server, or as a static file, then
             displays the host name, port, and protocol. Each time the page loads on
             a server, it saves the launch time in a lastLaunch cookie and shows the
             previous launch time from that cookie.
*/

/* ==========================================
   COOKIE HELPERS
========================================== */

// Saves a cookie that lasts the given number of days
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

// Returns a cookie value, or an empty string if it is not set
function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) === 0) {
            return decodeURIComponent(cookie.substring(cookieName.length));
        }
    }
    return "";
}

/* ==========================================
   DOM REFERENCES
========================================== */
const statusBox = document.getElementById("network-status");
const statusBadge = document.getElementById("status-badge");
const statusHeading = document.getElementById("status-heading");
const statusMessage = document.getElementById("status-message");

const hostOutput = document.getElementById("host-name");
const portOutput = document.getElementById("port-number");
const protocolOutput = document.getElementById("protocol-name");
const lastLaunchOutput = document.getElementById("last-launch");
const retestButton = document.getElementById("retest-button");

/* ==========================================
   CONNECTION DETECTION
   ------------------------------------------
   local  = served from this computer
   hosted = served from a web host
   static = opened straight from a file
========================================== */
const protocol = location.protocol.replace(":", "").toUpperCase();
const isLocalHost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const isServed = location.protocol === "http:" || location.protocol === "https:";

let connectionType = "static";
if (isServed && isLocalHost) {
    connectionType = "local";
}
else if (isServed) {
    connectionType = "hosted";
}

/* ==========================================
   SHOW CONNECTION DETAILS
========================================== */
hostOutput.textContent = location.hostname || "None (opened as a static file)";

if (location.port) {
    portOutput.textContent = location.port;
}
else if (location.protocol === "https:") {
    portOutput.textContent = "443 (default for HTTPS)";
}
else if (location.protocol === "http:") {
    portOutput.textContent = "80 (default for HTTP)";
}
else {
    portOutput.textContent = "None (no server port)";
}

protocolOutput.textContent = protocol;

/* ==========================================
   SHOW CONNECTION STATUS
========================================== */
if (connectionType === "local") {
    statusBox.className = "network-status status-connected";
    statusBadge.textContent = "Connected";
    statusHeading.textContent = "Local network connection recognized";
    statusMessage.textContent = "The site is being served by a local web server on this computer. It is not available to the public.";
}
else if (connectionType === "hosted") {
    statusBox.className = "network-status status-connected";
    statusBadge.textContent = "Online";
    statusHeading.textContent = "Hosted connection recognized";
    statusMessage.textContent = `The site is being served online from ${location.hostname}.`;
}
else {
    statusBox.className = "network-status status-offline";
    statusBadge.textContent = "Offline";
    statusHeading.textContent = "No network connection detected";
    statusMessage.textContent = "The page was opened directly as a file, so no server is involved. Launch the site with Live Preview to test the network connection.";
}

/* ==========================================
   LAST TIME LAUNCHED (COOKIE)
   ------------------------------------------
   Show the time saved on the previous visit,
   then save this visit for next time.
========================================== */
const previousLaunch = getCookie("lastLaunch");

if (previousLaunch) {
    lastLaunchOutput.textContent = previousLaunch;
}

if (connectionType !== "static") {
    const now = new Date().toLocaleString("en-US", {
        month: "long", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", second: "2-digit"
    });
    setCookie("lastLaunch", now, 30);
}
else {
    lastLaunchOutput.textContent = "Not available. Cookies are only saved when the site runs on a server.";
}

/* ==========================================
   RUN TEST AGAIN BUTTON
========================================== */
retestButton.addEventListener("click", function() {
    location.reload();
});
