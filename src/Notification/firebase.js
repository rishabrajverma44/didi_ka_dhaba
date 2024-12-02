import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyAxUoRkTINy8bGrh2HsxiXLfiH9QpfRmX0",
  authDomain: "didi-ka-dhaba.firebaseapp.com",
  projectId: "didi-ka-dhaba",
  storageBucket: "didi-ka-dhaba.firebasestorage.app",
  messagingSenderId: "421868569346",
  appId: "1:421868569346:web:67d65961d87621c6a0781b",
  measurementId: "G-QW79BC8VK8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      validKey:
        "BIZEm7mCBzTjnJ3ogMNNMH4wkJ-7iM08pWXOsN7xtBOc_kQm-rsf9r3wOqtzXZ7Hg9UVm9zTPmTT-ZSntqWdyD8",
    });
    console.log(token);
  }
};
