
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

    profile: {
      drafts: "Drafts",
      completed: "Completed",
      created: "Created",
      QRcode: "QRCode",
      support: "Support of E-Signie",
      about: "About E-Signie",
      logout: "Logout",
    },

    selectAgreement: {
      title: "Choose Agreement Type",
      titleSubtext1: "Create legally binding agreements online",
      titleSubtext2: "Follow this steps:",
      step1: "Select",
      step2: "Details",
      step3: "Preview",
      titleType: "Select Agreement Type",
      rental: "Rental Agreement",
      rentalSubtext: "For property rental or lease agreement.",
      employment: "Employment Agreement",
      employmentSubtext: "For hiring employees and contractors.",
      BandA: "Buy and Sale Agreement",
      BandAsubtext: "For purchasing and selling goods or services.",
      partnerShip: "Partnership Agreement",
      partnerShipSubtext: "To outline terms between bussiness partners.",
      NandA: "Non-Disclosure Agreement",
      NandAsubtext: "To protect confidential information between parties.",
      custom: "Custom Agreement",
      customSubtext: "Create a personalized agreement from scratch."
    },

    createAgreement: {
      title: "TITLE",
      TnC: "TERMS AND CONDITIONS",
      PandW: "PARTY'S AND WITNESSES",
      party: "Party",
      witness: "Witness",
      uploadBtn: "Upload ID",
      addPartyBtn: "Add Party"
    },

    viewAgreement: {

    },

    notification: {

    },

    logo: {

    }
    
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
        
    },
  
    profile: {
      drafts: "Mga Drafts",
      completed: "Nakumpleto",
      created: "Nagawa",
      QRcode: "I-Scan Ang QRCode",
      support: "Suporta ng E-Signie",
      about: "Tungkol sa E-Signie",
      logout: "Mag-Logout",
    },

    selectAgreement: {

    },

    createAgreement: {

    },

    viewAgreement: {

    },

    notification: {

    },

    logo: {
      
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