import { LanguageCode } from '../types/health';

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  dashboard: string;
  doctorView: string;
  emergencyMode: string;
  emergencyNotice: string;
  criticalAllergies: string;
  emergencyContacts: string;
  bloodGroup: string;
  activeMedications: string;
  refillNeeded: string;
  refillAlertMsg: string;
  takeDose: string;
  doseTaken: string;
  pillsLeft: string;
  quickActions: string;
  uploadReport: string;
  showQRCode: string;
  voiceSummary: string;
  readAloud: string;
  playingAudio: string;
  pauseAudio: string;
  accessSharing: string;
  qrExpiresIn: string;
  liveAccessLogs: string;
  healthTimeline: string;
  trendAnalytics: string;
  severeAllergyAlert: string;
  allergyInteractionWarning: string;
  contraindicated: string;
  zeroLoginNotice: string;
  callAmbulance: string;
  callPrimaryContact: string;
  vitalsOverview: string;
  normal: string;
  elevated: string;
  aiAnalyzing: string;
  dropReportFiles: string;
  orBrowse: string;
  capturePhoto: string;
  audioSpeechText: string;
}

export const translations: Record<LanguageCode, TranslationStrings> = {
  en: {
    appTitle: 'PulseHealth',
    appSubtitle: 'Unified Patient Health Network',
    dashboard: 'Patient Dashboard',
    doctorView: 'Doctor Clinical View',
    emergencyMode: 'Emergency Mode',
    emergencyNotice: 'Emergency Zero-Login Screen: Critical survival data for first responders & EMTs',
    criticalAllergies: 'Critical Allergies',
    emergencyContacts: 'Emergency Contacts',
    bloodGroup: 'Blood Group',
    activeMedications: 'Active Medications',
    refillNeeded: 'Refill Alert',
    refillAlertMsg: 'Low stock! Refill required within 3 days',
    takeDose: 'Mark Taken',
    doseTaken: 'Taken Today',
    pillsLeft: 'pills left',
    quickActions: 'Quick Actions',
    uploadReport: 'Upload Report',
    showQRCode: 'Share QR Code',
    voiceSummary: 'AI Health Summary',
    readAloud: 'Read Aloud (Voice)',
    playingAudio: 'Playing Audio Summary...',
    pauseAudio: 'Pause Audio',
    accessSharing: '24-Hour Access Sharing',
    qrExpiresIn: 'Temporary Doctor Access Expires In',
    liveAccessLogs: 'Live Access Audit Trail',
    healthTimeline: 'Clinical Reports & Scans Timeline',
    trendAnalytics: 'Vital Biomarker Trends (Sugar, BP, Lipid)',
    severeAllergyAlert: 'CRITICAL DRUG-ALLERGY CONTRAINDICATION DETECTED',
    allergyInteractionWarning: 'Patient is anaphylactically sensitive to Penicillins and Sulfa drugs. Do not administer beta-lactam class antibiotics.',
    contraindicated: 'Contraindicated',
    zeroLoginNotice: 'ZERO-LOGIN RESCUE INTERFACE • NO PASSCODE REQUIRED',
    callAmbulance: 'Call Ambulance (108)',
    callPrimaryContact: 'Call Primary Contact',
    vitalsOverview: 'Current Vitals Overview',
    normal: 'Normal',
    elevated: 'Elevated',
    aiAnalyzing: 'AI is analyzing your report & extracting clinical biomarkers...',
    dropReportFiles: 'Drag & drop lab reports or prescriptions (PDF, PNG, JPG)',
    orBrowse: 'or click to browse files',
    capturePhoto: 'Snap Photo with Camera',
    audioSpeechText: 'Hello. Here is your verified medical summary: Your blood group is B Positive. You have a critical allergy to Penicillin. You have active medications monitored and verified by your attending physician. Your blood pressure has improved to 128 over 82.',
  },
  hi: {
    appTitle: 'पल्सहेल्थ (PulseHealth)',
    appSubtitle: 'एकीकृत रोगी स्वास्थ्य रिकॉर्ड',
    dashboard: 'रोगी डैशबोर्ड',
    doctorView: 'डॉक्टर क्लिनिकल व्यू',
    emergencyMode: 'आपातकालीन मोड',
    emergencyNotice: 'आपातकालीन ज़ीरो-लॉगिन स्क्रीन: प्राथमिक चिकित्सकों के लिए महत्वपूर्ण डेटा',
    criticalAllergies: 'गंभीर एलर्जी',
    emergencyContacts: 'आपातकालीन संपर्क',
    bloodGroup: 'रक्त समूह (Blood Group)',
    activeMedications: 'सक्रिय दवाइयाँ',
    refillNeeded: 'दवा रीफ़िल चेतावनी',
    refillAlertMsg: 'दवा कम है! 3 दिनों के भीतर रीफ़िल आवश्यक',
    takeDose: 'दवा ली गई दर्ज करें',
    doseTaken: 'आज ली गई',
    pillsLeft: 'गोलियां शेष',
    quickActions: 'त्वरित कार्य',
    uploadReport: 'रिपोर्ट अपलोड करें',
    showQRCode: 'QR कोड दिखाएं',
    voiceSummary: 'AI स्वास्थ्य सारांश',
    readAloud: 'आवाज़ में सुनें (Read Aloud)',
    playingAudio: 'ऑडियो सारांश चल रहा है...',
    pauseAudio: 'ऑडियो रोकें',
    accessSharing: '24-घंटे एक्सेस साझाकरण',
    qrExpiresIn: 'अस्थायी एक्सेस समाप्त होने में समय:',
    liveAccessLogs: 'लाइव एक्सेस ऑडिट लॉग',
    healthTimeline: 'क्लिनिकल रिपोर्ट और स्कैन टाइमलाइन',
    trendAnalytics: 'महत्वपूर्ण बायोमार्कर रुझान (शुगर, बीपी, लिपिड)',
    severeAllergyAlert: 'गंभीर दवा-एलर्जी परस्पर विरोध चेतावनी',
    allergyInteractionWarning: 'मरीज को पेनिसिलिन और सल्फा दवाओं से तीव्र एलर्जी है। बीटा-लैक्टम एंटीबायोटिक न दें।',
    contraindicated: 'प्रतिबंधित दवा',
    zeroLoginNotice: 'ज़ीरो-लॉगिन बचाव इंटरफ़ेस • किसी पासवर्ड की आवश्यकता नहीं',
    callAmbulance: 'एम्बुलेंस को कॉल करें (108)',
    callPrimaryContact: 'प्राथमिक संपर्क को कॉल करें',
    vitalsOverview: 'वर्तमान वाइटल्स अवलोकन',
    normal: 'सामान्य',
    elevated: 'बढ़ा हुआ',
    aiAnalyzing: 'एआई आपकी रिपोर्ट का विश्लेषण कर रहा है...',
    dropReportFiles: 'लैब रिपोर्ट या पर्चे यहां खींचें और छोड़ें (PDF, PNG, JPG)',
    orBrowse: 'या फाइल चुनने के लिए क्लिक करें',
    capturePhoto: 'कैमरे से फोटो लें',
    audioSpeechText: 'नमस्ते राजेश। यह आपका स्वास्थ्य सारांश है: आपका रक्त समूह बी पॉजिटिव है। आपको पेनिसिलिन से गंभीर एलर्जी है। आप 3 दवाइयाँ ले रहे हैं: मेटफ़ॉर्मिन, टेल्मिसार्टन और रोसुवास्टैटिन। मेटफ़ॉर्मिन की गोलियाँ कम हैं और 3 दिनों में फिर से लेनी होंगी। आपका रक्तचाप 128 और 82 पर स्थिर है।',
  },
  kn: {
    appTitle: 'ಪಲ್ಸ್ ಹೆಲ್ತ್ (PulseHealth)',
    appSubtitle: 'ಸಮಗ್ರ ರೋಗಿ ಆರೋಗ್ಯ ದಾಖಲೆ',
    dashboard: 'ರೋಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    doctorView: 'ವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ವೀಕ್ಷಣೆ',
    emergencyMode: 'ತುರ್ತು ಮೋಡ್',
    emergencyNotice: 'ತುರ್ತು ಜೀರೋ-ಲಾಗಿನ್ ಸ್ಕ್ರೀನ್: ಪ್ರಥಮ ಚಿಕಿತ್ಸಕರಿಗೆ ನಿರ್ಣಾಯಕ ಜೀವ ಉಳಿಸುವ ಮಾಹಿತಿ',
    criticalAllergies: 'ತೀವ್ರ ಅಲರ್ಜಿಗಳು',
    emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
    activeMedications: 'ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಔಷಧಿಗಳು',
    refillNeeded: 'ಔಷಧಿ ಮರುಪೂರಣ ಎಚ್ಚರಿಕೆ',
    refillAlertMsg: 'ಔಷಧಿ ಕಡಿಮೆಯಾಗಿದೆ! 3 ದಿನಗಳಲ್ಲಿ ಮರುಪೂರಣ ಅಗತ್ಯ',
    takeDose: 'ಮಾತ್ರೆ ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ',
    doseTaken: 'ಇಂದು ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ',
    pillsLeft: 'ಮಾತ್ರೆಗಳು ಉಳಿದಿವೆ',
    quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    uploadReport: 'ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    showQRCode: 'QR ಕೋಡ್ ಹಂಚಿಕೊಳ್ಳಿ',
    voiceSummary: 'AI ಆರೋಗ್ಯ ಸಾರಾಂಶ',
    readAloud: 'ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ (Read Aloud)',
    playingAudio: 'ಆಡಿಯೋ ಪ್ಲೇ ಆಗುತ್ತಿದೆ...',
    pauseAudio: 'ಆಡಿಯೋ ವಿರಾಮಗೊಳಿಸಿ',
    accessSharing: '24-ಗಂಟೆಗಳ ಪ್ರವೇಶ ಹಂಚಿಕೆ',
    qrExpiresIn: 'ವೈದ್ಯರ ಪ್ರವೇಶ ಮುಕ್ತಾಯವಾಗಲು ಉಳಿದ ಸಮಯ:',
    liveAccessLogs: 'ಲೈವ್ ಪ್ರವೇಶ ಲಾಗ್ ವಿವರ',
    healthTimeline: 'ವರದಿಗಳು ಮತ್ತು ಸ್ಕ್ಯಾನ್ ಟೈಮ್‌ಲೈನ್',
    trendAnalytics: 'ಆರೋಗ್ಯ ಗ್ರಾಫ್ ವಿಶ್ಲೇಷಣೆ (ಶುಗರ್, ಬಿಪಿ, ಕೊಲೆಸ್ಟ್ರಾಲ್)',
    severeAllergyAlert: 'ತೀವ್ರ ಔಷಧಿ ಅಲರ್ಜಿ ಅಪಾಯದ ಮುನ್ನೆಚ್ಚರಿಕೆ',
    allergyInteractionWarning: 'ರೋಗಿಗೆ ಪೆನ್ಸಿಲಿನ್ ಮತ್ತು ಸಲ್ಫಾ ಔಷಧಿಗಳಿಂದ ಗಂಭೀರ ಅಲರ್ಜಿ ಇದೆ. ಬೀಟಾ-ಲ್ಯಾಕ್ಟಮ್ ಗುಂಪಿನ ಔಷಧಿ ನೀಡಬೇಡಿ.',
    contraindicated: 'ನಿಷೇಧಿತ ಔಷಧಿ',
    zeroLoginNotice: 'ಜೀರೋ-ಲಾಗಿನ್ ರಕ್ಷಣಾ ಇಂಟರ್ಫೇಸ್ • ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ',
    callAmbulance: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ (108)',
    callPrimaryContact: 'ತುರ್ತು ಸಂಪರ್ಕಕ್ಕೆ ಕರೆ ಮಾಡಿ',
    vitalsOverview: 'ಪ್ರಸ್ತುತ ಪ್ರಮುಖ ಆರೋಗ್ಯ ಸೂಚಕಗಳು',
    normal: 'ಸಾಮಾನ್ಯ',
    elevated: 'ಸ್ವಲ್ಪ ಅಧಿಕ',
    aiAnalyzing: 'AI ನಿಮ್ಮ ವರದಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ...',
    dropReportFiles: 'ವರದಿಗಳನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ ಮತ್ತು ಬಿಡಿ (PDF, PNG, JPG)',
    orBrowse: 'ಅಥವಾ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
    capturePhoto: 'ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    audioSpeechText: 'ನಮಸ್ಕಾರ ರಾಜೇಶ್. ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಾರಾಂಶ: ನಿಮ್ಮ ರಕ್ತದ ಗುಂಪು ಬಿ ಪಾಸಿಟಿವ್. ನಿಮಗೆ ಪೆನ್ಸಿಲಿನ್ ಅಲರ್ಜಿ ಇದೆ. ನೀವು ಮೂರು ಔಷಧಿಗಳನ್ನು ಸೇವಿಸುತ್ತಿದ್ದೀರಿ: ಮೆಟ್‌ಫಾರ್ಮಿನ್, ಟೆಲ್ಮಿಸಾರ್ಟನ್ ಮತ್ತು ರೋಸುವಾಸ್ಟಾಟಿನ್. ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಮಾತ್ರೆಗಳು ಕಡಿಮೆಯಿದ್ದು 3 ದಿನಗಳಲ್ಲಿ ಪಡೆಯಬೇಕು. ನಿಮ್ಮ ರಕ್ತದೊತ್ತಡ ನಿಯಂತ್ರಣದಲ್ಲಿದೆ.',
  },
  ta: {
    appTitle: 'பல்ஸ்ஹெல்த் (PulseHealth)',
    appSubtitle: 'ஒருங்கிணைந்த நோயாளி சுகாதார பதிவு',
    dashboard: 'நோயாளி டாஷ்போர்டு',
    doctorView: 'மருத்துவர் மருத்துவ பார்வை',
    emergencyMode: 'அவசர சிகிச்சை பயன்முறை',
    emergencyNotice: 'அவசர பூஜ்ஜிய-உள்நுழைவு திரை: முதலுதவி குழுவினருக்கான முக்கியமான தரவு',
    criticalAllergies: 'முக்கிய ஒவ்வாமைகள் (Allergies)',
    emergencyContacts: 'அவசர தொடர்புகள்',
    bloodGroup: 'இரத்த வகை (Blood Group)',
    activeMedications: 'நடப்பு மருந்துகள்',
    refillNeeded: 'மருந்து மறு நிரப்பல் எச்சரிக்கை',
    refillAlertMsg: 'மருந்துகள் குறைவாக உள்ளது! 3 நாட்களில் பெறவும்',
    takeDose: 'மருந்து எடுத்ததாக குறிக்கவும்',
    doseTaken: 'இன்று எடுக்கப்பட்டது',
    pillsLeft: 'மாத்திரைகள் உள்ளன',
    quickActions: 'விரைவு செயல்கள்',
    uploadReport: 'அறிக்கையை பதிவேற்றவும்',
    showQRCode: 'QR குறியீட்டைக் காட்டு',
    voiceSummary: 'AI சுகாதார சுருக்கம்',
    readAloud: 'குரல் வழியே கேட்கவும் (Read Aloud)',
    playingAudio: 'ஆடியோ சுருக்கம் ஒலிக்கிறது...',
    pauseAudio: 'ஆடியோவை இடைநிறுத்து',
    accessSharing: '24-மணி நேர அணுகல் பகிர்வு',
    qrExpiresIn: 'மருத்துவர் அணுகல் காலாவதியாக மீதமுள்ள நேரம்:',
    liveAccessLogs: 'நேரலை அணுகல் பதிவு',
    healthTimeline: 'மருத்துவ அறிக்கைகள் மற்றும் ஸ்கேன் காலவரிசை',
    trendAnalytics: 'முக்கிய சுகாதார வரைபடங்கள் (சர்க்கரை, பிபி, கொழுப்பு)',
    severeAllergyAlert: 'கடுமையான மருந்து ஒவ்வாமை எச்சரிக்கை',
    allergyInteractionWarning: 'நோயாளிக்கு பென்சிலின் மற்றும் சல்ஃபா மருந்துகளால் கடுமையான ஒவ்வாமை உள்ளது. பீட்டா-லாக்டம் மருந்துகளை தவிர்க்கவும்.',
    contraindicated: 'தடைசெய்யப்பட்ட மருந்து',
    zeroLoginNotice: 'பூஜ்ஜிய-உள்நுழைவு அவசர திரை • கடவுச்சொல் தேவையில்லை',
    callAmbulance: 'ஆம்புலன்ஸ் அழைக்கவும் (108)',
    callPrimaryContact: 'அவசர தொடர்பை அழைக்கவும்',
    vitalsOverview: 'தற்போதைய முக்கிய அறிகுறிகள்',
    normal: 'சாதாரணமானது',
    elevated: 'அதிகரித்துள்ளது',
    aiAnalyzing: 'AI உங்கள் அறிக்கையை பகுப்பாய்வு செய்கிறது...',
    dropReportFiles: 'ஆய்வக அறிக்கைகளை இங்கே இழுத்து விடவும் (PDF, PNG, JPG)',
    orBrowse: 'அல்லது கோப்பை தேர்வு செய்யவும்',
    capturePhoto: 'கேமரா மூலம் புகைப்படம் எடுக்கவும்',
    audioSpeechText: 'வணக்கம் ராஜேஷ். உங்கள் சுகாதார சுருக்கம்: உங்கள் இரத்த வகை பி பாசிட்டிவ். உங்களுக்கு பென்சிலின் ஒவ்வாமை உள்ளது. நீங்கள் மெட்ஃபோர்மின், டெல்மிசார்டன் மற்றும் ரோசுவாஸ்டேடின் உட்கொள்கிறீர்கள். மெட்ஃபோர்மின் மாத்திரைகள் குறைவாக உள்ளன, 3 நாட்களில் மீண்டும் வாங்க வேண்டும். உங்கள் ரத்த அழுத்தம் சீராக உள்ளது.',
  }
};
