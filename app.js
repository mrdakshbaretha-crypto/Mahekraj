// Firebase config (from your Firebase project)
const firebaseConfig = {
  apiKey: "AIzaSyBeV-ujRqa5vyNbyYotpfL1lFui5Ybt66Y",
  authDomain: "organic-store-16658.firebaseapp.com",
  projectId: "organic-store-16658",
  storageBucket: "organic-store-16658.firebasestorage.app",
  messagingSenderId: "1017281253636",
  appId: "1:1017281253636:web:27fbeab39157bf533ec051",
  measurementId: "G-NLFGB94DC7"
};

// Load Firebase from CDN and initialize
(function(){
  const script = document.createElement('script');
  script.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
  script.onload = () => {
    const dbScript = document.createElement('script');
    dbScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";
    dbScript.onload = initFirebase;
    document.head.appendChild(dbScript);
  };
  document.head.appendChild(script);

  function initFirebase(){
    try{
      firebase.initializeApp(firebaseConfig);
      window.db = firebase.firestore();
      console.log('✅ Firebase initialized');
    }catch(e){
      console.error('❌ Firebase init error', e);
    }
  }
})();
