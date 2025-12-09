
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
        close: "Close",
        no_login_history: "No Login History Found",
        clear_login_history_message: "Clear login history?",
        clear_login_history: "Clear",
        login_history_cleared: "Login history cleared."
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
    },

    login: {
      "greetings": [
      "Hello there!",
      "Nice to see you back!",
      "Welcome Back!",
      "Good Day!",
      "Howly Mowly"
    ],

    subtitle: "E-SIGNIE",

    email_placeholder: "Email",
    password_placeholder: "Password",

    remember_me: "Remember Me",
    forgot_password: "Forgot Password?",

    login_button: "Log In",
    login_loading: "Logging in...",

    no_account: "Don't have an account?",
    signup_here: "Sign Up",

    error_fill_fields: "Please fill in all fields",
    error_invalid_email: "Please enter a valid email address",
    error_failed_signin: "Failed to sign in",

    success_created: "Account Successfully Created!",

    lang_english: "English",
    lang_filipino: "Filipino"
    },

    register: {
    title: "Create Account",
    subtitle: "Sign up to get started",
    name_placeholder: "Full Name",
    email_placeholder: "Email",
    password_placeholder: "Password",
    confirm_password_placeholder: "Confirm Password",
    error_fill_fields: "Please fill in all fields",
    error_invalid_email: "Please enter a valid email address",
    error_password_length: "Password must be at least 6 characters",
    error_password_mismatch: "Passwords do not match",
    error_agree_terms: "Please agree to the terms and conditions.",
    error_failed_signup: "Failed to create account",
    create_account: "Create",
    creating_account: "Creating Account...",
    already_have_account: "Already have an account?",
    go_back: "Go back",
    terms_title: "Terms and Conditions",
    terms_content: "Welcome to E-Signie! By creating an account, you agree to use this app responsibly...",
    cancel: "Cancel",
    agree: "I Agree",
    terms_text_prefix: "I agree to the",
    terms_text_link: "Terms and Conditions"
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
        close: "isara",
        no_login_history: "Walang Nahanap na Login History",
        clear_login_history_message: "I-clear ang talaan ng pag-login?",
        clear_login_history: "Linisin",
        login_history_cleared: "Nai-clear na ang talaan ng pag-login."

        
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
    },

    login: {
    greetings: [
      "Kamusta!",
      "Buti nagbalik ka!",
      "Maligayang\n Pagbabalik!",
      "Magandang Araw!",
      "Ayun! Bumalik Ka!"
    ],

    subtitle: "E-SIGNIE",

    email_placeholder: "Email",
    password_placeholder: "Password",

    remember_me: "Tandaan Ako",
    forgot_password: "Nakalimutan?",

    login_button: "Mag Log In",
    login_loading: "Nagla-log in...",

    no_account: "Wala ka pang account?",
    signup_here: "Mag-sign Up",

    error_fill_fields: "Paki-fill up ang lahat ng fields",
    error_invalid_email: "Maglagay ng valid na email address",
    error_failed_signin: "Hindi makapag-log in",

    success_created: "Matagumpay na Nalikha ang Account!",

    lang_english: "Ingles",
    lang_filipino: "Filipino"

  },

  register: {
    title: "Gumawa ng Account",
    subtitle: "Mag-sign up upang makapagsimula",
    name_placeholder: "Buong Pangalan",
    email_placeholder: "Email",
    password_placeholder: "Password",
    confirm_password_placeholder: "Kumpirmahin ang Password",
    error_fill_fields: "Paki-fill up ang lahat ng fields",
    error_invalid_email: "Maglagay ng valid na email address",
    error_password_length: "Ang password ay dapat hindi bababa sa 6 na karakter",
    error_password_mismatch: "Hindi magkatugma ang password",
    error_agree_terms: "Mangyaring sumang-ayon sa mga tuntunin at kundisyon.",
    error_failed_signup: "Hindi malikha ang account",
    create_account: "Gawin",
    creating_account: "Gumagawa ng Account...",
    already_have_account: "May account ka na ba?",
    go_back: "Bumalik",
    terms_title: "Mga Tuntunin at Kundisyon",
    terms_content: "Maligayang pagdating sa E-Signie! Sa paggawa ng account, sumasang-ayon kang gamitin ang app nang responsable...",
    cancel: "Kanselahin",
    agree: "Sang-ayon ako",
    terms_text_prefix: "Sang-ayon ako sa :",
    terms_text_link: "Mga Tuntunin at Kundisyon"
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