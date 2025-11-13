
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


const eng={
    settings: {
        title: "Settings",
        dark_mode: "Dark Mode/Light Mode",
        account_privacy: "Account & Privacy",
        language: "Language",
        notification: "Notification Permission",
        login_history: "Login History",
        clear_storage: "Clear Storage",
        clear_storage_alert_title: "Clear Storage?",
        clear_storage_alert_message: "This will delete all locally saved data. You can't undo this action.",
        clear: "Clear",
        cancel: "Cancel",
        storage_clear_title: "Storage Cleared",
        storage_clear_message: "All data has been removed",
        error: "Error occured",
        error_message: "There was a problem while clearing storage",
        
    },
}

const fil={
    settings: {
        title: "Mga Settings",
        dark_mode: "Madilim at Maliwanag na Tema",
        account_privacy: "Mga Account at Privacy",
        language: "Lingguwahe",
        notification: "Abiso",
        login_history: "Mga Login History",
        clear_storage: "Linisin ang Storage",
        clear_storage_alert_title: "Linisin ang Storage?",
        clear_storage_alert_message: "Mabubura nito ang lahat ng data na naka-save sa lokal. Hindi mo maaaring bawiin ang aksyong ito.",
        clear: "Linisin",
        cancel: "kanselahin",
        storage_clear_title: "Nalinis na ang iyong storage",
        storage_clear_message: "Lahat ng iyong naka-save na data ay nalinis",
        error: "Mayroong error na humadlang",
        error_message: "Nagkaroon ng error habang naglilinis ng iyong storage",
        
    }
    

}

i18n.use(initReactI18next).init({
  lng: 'fil', // default language
  fallbackLng: 'en',
  resources: {
    en: { translation: eng },
    fil: { translation: fil },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;