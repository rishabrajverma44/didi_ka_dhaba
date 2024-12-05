export default function swDev() {
  const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

  navigator.serviceWorker
    .register(swUrl)
    .then((response) => {
      console.warn("Service Worker registered successfully:", response);

      console.log("Current URL:", window.location.href);

      if (navigator.serviceWorker.controller) {
        console.log("Service Worker is controlling the page.");
      } else {
        console.log("Service Worker is not controlling the page.");
      }
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready
      .then((sw) => {
        return sw.sync.register("sync-data");
      })
      .then(() => {
        console.log("Sync registered successfully!");
      })
      .catch((error) => {
        console.error("Failed to register sync:", error);
      });
  } else {
    console.warn("Background Sync is not supported in this browser.");
  }
}
