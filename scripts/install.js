"use strict";

// Save a reference to the event
let deferredInstallPrompt = null;

const installButton = document.getElementById("installButton");

// Listen to the event fired by the browser if the app is installable
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("The application is elligible for installation !");
  deferredInstallPrompt = e;
  installButton.removeAttribute("hidden");
});

installButton.addEventListener("click", installPWA);

function installPWA(e) {
  // Show install prompt
  deferredInstallPrompt.prompt();
  // Hide the install button
  e.srcElement.setAttribute("hidden", true);

  // Log user response
  deferredInstallPrompt.userChoice.then((choice) => {
    const userAccepted = choice.outcome === "accepted";
    console.log(
      `User ${userAccepted ? "accepted" : "dismissed"} the installation`,
      choice
    );
    deferredInstallPrompt = null;
  });
}

// Log something if the user installed the app
window.addEventListener("appinstalled", (e) => {
  console.log("The application was installed.", e);
});
