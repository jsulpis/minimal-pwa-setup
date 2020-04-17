const isRunningStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone;
if (isRunningStandalone) {
  console.log("The application is running in standalone mode.");
  document.getElementById("congratsMessage").removeAttribute("hidden");
}

// Register the service worker if available
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("Service worker registered:", reg);
      })
      .catch((err) =>
        console.error("Service worker registration failed:", err)
      );
  });
}
