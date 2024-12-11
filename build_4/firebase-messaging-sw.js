importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAxUoRkTINy8bGrh2HsxiXLfiH9QpfRmX0",
  authDomain: "didi-ka-dhaba.firebaseapp.com",
  projectId: "didi-ka-dhaba",
  storageBucket: "didi-ka-dhaba.firebasestorage.app",
  messagingSenderId: "421868569346",
  appId: "1:421868569346:web:67d65961d87621c6a0781b",
  measurementId: "G-QW79BC8VK8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
