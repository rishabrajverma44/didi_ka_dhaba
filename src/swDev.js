export default function swDev() {
  const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(swUrl)
      .then((response) => {
        console.log("Service Worker registered successfully:", response);
        if (navigator.serviceWorker.controller) {
          console.log("Service Worker is controlling the page.");
        } else {
          console.log("Service Worker is not controlling the page.");
        }
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });

    if ("SyncManager" in window) {
      navigator.serviceWorker.ready
        .then((sw) => sw.sync.register("sync-data"))
        .then(() => console.log("Sync registered successfully!"))
        .catch((error) => {
          console.error("Failed to register sync:", error);
        });
    } else {
      console.warn("Background Sync is not supported in this browser.");
    }
  } else {
    console.warn("Service Worker is not supported in this browser.");
  }
}
