
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
      placeholderTitle: "Ex: ESignie Agreement",
      TnC: "TERMS AND CONDITIONS",
      placeholderTerms: "Write your Agreement Title, Terms, and Conditions here...",
      PandW: "PARTY'S AND WITNESSES",
      party: "Party",
      witness: "Witness",
      uploadBtn: "Upload ID",
      addPartyBtn: "Add Party",
      addWitnessBtn: "Add Witness",
      phonenum: "Phone No.",
      fullname: "Full Name",
      role: "Role",
      address: "Address",
      selectID: "Select ID Type",
      other: "Other",
      uploadIDBtn: "Upload ID",
      create: "Create Agreement",
      selected: "Selected ID Type",
      noImage: "No Image Selected"
    },

    id: {
      details: "Agreement Details",
      error: "Agreement not found",
      failed: "Failed to load agreement",
      deleteTitle: "Delete Agreement",
      deleteSubtext: "Are you sure you want to delete this agreement? This action cannot be undone.",
      cancel: "Cancel",
      proceed: "Delete",
      export: "Export PDF",
      TnC: "Terms and Conditions",
      parties: "Parties",
      witness: "Witness",
      idnum: "ID Number",
      idphoto: "ID Photo",
      signTitle: "Signature",
      addSign: "Add Signature",
      nowitness: "No witness added to this agreement"
    },

    
    logo: {

    },

    agreement: {
      noAgreeYet: "No Agreements Yet",
      noAgreeYetsubtext: "Create your first agreement using the Create tab",
      retry: "Retry"
    },

    homeAgreement: {
      tabTitle1: "Agreement",
      tabTitle2: "Profile"
    },

    layout: {
      notif1: "Notifications",
      notif2: "No New Notification"
    },

    signature: {
      title: "Sign Agreement",
      signFor: "Signature For {{name}}",
      clear: "Clear",
      save: "Save"
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
      title: "Pumili ng Uri Ng Kasunduan",
      titleSubtext1: "Lumikha ng mga legal na may-bisang kasunduan online",
      titleSubtext2: "Sundin Ang Mga Hakbang:",
      step1: "Piliin",
      step2: "Detalye",
      step3: "Silipin",
      titleType: "Piliin Ang Uri Ng Kasunduan",
      rental: "Kasunduan sa Pagpapaupa",
      rentalSubtext: "Para sa pagrenta ng ari-arian o kasunduan sa pag-upa.",
      employment: "Kasunduan sa Pagtatrabaho",
      employmentSubtext: "Para sa pagkuha ng mga empleyado at kontratista.",
      BandA: "Kasunduan sa Pagbili at Pagbebenta",
      BandAsubtext: "Para sa pagbili at pagbebenta ng mga kalakal o serbisyo.",
      partnerShip: "Kasunduan sa Pakikipagsosyo",
      partnerShipSubtext: "Upang balangkasin ang mga tuntunin sa pagitan ng mga kasosyo sa negosyo.",
      NandA: "Kasunduan sa Non-Disclosure",
      NandAsubtext: "Upang protektahan ang kumpidensyal na impormasyon sa pagitan ng mga partido.",
      custom: "Custom na Kasunduan",
      customSubtext: "Gumawa ng personalized na kasunduan."
    },

    createAgreement: {
      title: "PAKSA",
      placeholderTitle: "Hal: Agreement ng ESignie",
      TnC: "MGA TUNTUNIN AT KONDISYON",
      placeholderTerms: "Isulat dito ang pamagat, tuntunin, at kondisyon...",
      PandW: "MGA PARTIDO AT SAKSI",
      party: "Partido",
      witness: "Saksi",
      addPartyBtn: "Magdagdag Ng Partido",
      addWitnessBtn: "Magdagdag Ng Saksi",
      saving: "Nagsa-save...",
      uploadBtn: "Gumawa Ng Kasunduan",
      selectID: "Pumili Ng Uri Ng ID",
      nationalID: "National ID",
      postalID: "Postal ID",
      license: "License",
      other: "Iba",
      uploadIDBtn: "Mag-Upload Ng ID",
      scanStatus: "Naka-scan",
      loginRequired: "Kailangan mag-login upang gumawa ng kasunduan",
      success: 'Ang kasunduan "{{title}}" ay matagumpay na nalikha!',
      phonenum: "Telepono",
      fullname: "Buong Pangalan",
      role: "Tungkulin",
      address: "Tirahan",
      create: "Gawin Ang Kasunduan",
      selected: "Napiling Uri Ng ID",
      noImage: "Walang Litratong Napili"
    },

    id: {
      details: "Detalye Ng Kasunduan",
      error: "Hindi natagpuan ang kasunduan",
      failed: "Nabigong i-load ang kasunduan",
      deleteTitle: "Burahin ang kasunduan",
      deleteSubtext: "Sigurado ka bang gusto mong tanggalin ang kasunduang ito? Ang pagkilos na ito ay hindi maaaring i-undo.",
      cancel: "Kanselahin",
      proceed: "Burahin",
      export: "I-Export ang PDF",
      TnC: "Mga Tuntunin at Kundisyon",
      parties: "Partido",
      witness: "Saksi",
      idnum: "Telepono",
      idphoto: "Litrato ng ID",
      signTitle: "Pirma",
      addSign: "Pumirma",
      nowitness: "Walang saksi na idinagdag sa kasunduang ito"
    },

    

    logo: {
      
    },

    agreement: {
      noAgreeYet: "Wala Pang Nagawang Kasunduan",
      noAgreeYetsubtext: "Lumikha ng iyong unang kasunduan gamit ang Create Tab",
      retry: "Ulitin"
    },

    homeAgreement: {
      tabTitle1: "Kasunduan",
      tabTitle2: "Propayl"
    },

    layout: {
      notif1: "Mga Abiso",
      notif2: "Walang Bagong Abiso"
    },

    signature: {
      title: "Lagda ng Kasunduan",
      signFor: "Pirma Para Kay {{name}}",
      clear: "Ulitin",
      save: "I-Save"
    }



}

i18n.use(initReactI18next).init({
  lng: 'eng', // default language
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