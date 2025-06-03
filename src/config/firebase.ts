
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD_qJ4483uJkwMNUcL4gVaaRasPuJcAsM8",
  authDomain: "shopnaija-6960f.firebaseapp.com",
  projectId: "shopnaija-6960f",
  storageBucket: "shopnaija-6960f.firebasestorage.app",
  messagingSenderId: "282021173324",
  appId: "1:282021173324:web:6dee9b6bdf8a7a30a3fce9",
  measurementId: "G-CBDD84PF21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const vapidKey = "BMLD7VerB0gEaLcUgPTswV6Ldt4J9BxZiEhGEZS_BFUJjDmMOA8FEudH4867HA5qSvnBZlz5plCbWQ7Xbj_wru4";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey });
      console.log('FCM Token:', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
