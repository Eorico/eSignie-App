import { RealTimeDataBase } from "./firebase";
import { ref, onValue } from 'firebase/database';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SubscriptionToRealTimeDatabase = (collectionName: string, localkey: string) => {
    const dbRef = ref(RealTimeDataBase, collectionName);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const arrayData = Object.values(data);
            AsyncStorage.setItem(localkey, JSON.stringify(arrayData))
            .then(() => console.log(`Local ${localkey} updated from firebase realtime database.`))
            .catch(err => console.log("AsyncStorage update error:", err));
        } else {
            AsyncStorage.setItem(localkey, JSON.stringify([]));
        }
    });
};