// firebase integration

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConFigurations = {
    apiKey: "AIzaSyDH1QU54QuY9oUUf5VkrnBoxrOQdvjFUuU",
    authDomain: "e-signie.firebaseapp.com",
    projectId: "e-signie",
    storageBucket: "e-signie.firebasestorage.app",
    messagingSenderId: "103845413432",
    appId: "1:103845413432:web:6fe3098a9f1c109885dccd",
    measurementId: "G-ZQRS321R66",
    databaseURL: "https://e-signie-default-rtdb.asia-southeast1.firebasedatabase.app"
}

const app = initializeApp(firebaseConFigurations);

let auth: Auth;

if (!getAuth.length) {
    auth = getAuth(app);
}

try {
    const { getReactNativePersistence } = require('firebase/auth/react-native')
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    })
} catch (firebaseError) {
    auth = getAuth(app);
}
 
export const RealTimeDataBase = getDatabase(app);
export const storage = getStorage(app);

export { auth };
