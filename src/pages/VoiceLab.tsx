import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import TryItLiveCTA from '../components/TryItLiveCTA';

interface VoicePersona {
  id: string;
  lang: string;
  nativeScript: string;
  region: string;
  femaleName: string;
  maleName: string;
  tag: string;
  sampleText: {
    native: string;
    english: string;
  };
  scenarios: {
    title: string;
    icon: string;
    dialogue: string;
  }[];
  audio: {
    female: string;
    male: string;
  };
}

export default function VoiceLab() {
  const [selectedLang, setSelectedLang] = useState<string>('Hindi');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const personas: VoicePersona[] = [
    {
      id: 'hindi',
      lang: 'Hindi',
      nativeScript: 'हिन्दी',
      region: 'North & Central India',
      femaleName: 'Aditi',
      maleName: 'Aarav',
      tag: 'Bilingual Hinglish Fluent',
      sampleText: {
        native: 'नमस्ते! मैं डायलोरा से बात कर रही हूँ। क्या आप अपनी नई प्रॉपर्टी देखने के लिए इस शनिवार उपलब्ध हैं?',
        english: 'Namaste! I am calling from Dialora. Are you available this Saturday to visit your selected property?'
      },
      scenarios: [
        {
          title: 'Real Estate Visit',
          icon: '🏢',
          dialogue: 'नमस्ते राहुल जी! व्हाइटफील्ड वाले 3BHK प्रोजेक्ट के लिए आपकी इन्क्वायरी मिली थी। क्या शनिवार को साइट विजिट प्लान करें?'
        },
        {
          title: 'COD Confirmation',
          icon: '📦',
          dialogue: 'नमस्ते! आपका ब्लू डार्ट ऑर्डर #4910 कन्फर्म करने के लिए कॉल किया है। क्या आपका डिलीवरी एड्रेस सही है?'
        },
        {
          title: 'Clinic Booking',
          icon: '🩺',
          dialogue: 'नमस्ते! डॉ. शर्मा कल सुबह 11 बजे और शाम 5 बजे उपलब्ध हैं। आप कौन सा टाइम स्लॉट चुनना चाहेंगे?'
        },
        {
          title: 'Payment Reminder',
          icon: '💳',
          dialogue: 'नमस्ते अमित जी, आपके क्रेडिट कार्ड का बिल कल देय है। क्या मैं आपके व्हाट्सएप पर तुरंत पेमेंट लिंक भेज दूँ?'
        }
      ],
      audio: {
        female: 'audio/Hindi_female.mp3',
        male: 'audio/Hindi_Male.mp3'
      }
    },
    {
      id: 'english',
      lang: 'English (India)',
      nativeScript: 'Indian Accent',
      region: 'Pan-India Corporate',
      femaleName: 'Priya',
      maleName: 'Rohan',
      tag: 'Corporate & Support Tier-1',
      sampleText: {
        native: 'Hi! This is Dialora calling from customer intelligence. How can I assist with your subscription today?',
        english: 'Hi! This is Dialora calling from customer intelligence. How can I assist with your subscription today?'
      },
      scenarios: [
        {
          title: 'Enterprise Qualification',
          icon: '💼',
          dialogue: 'Hi John, thank you for requesting a demo of Dialora. How many outbound calls does your team currently handle each day?'
        },
        {
          title: 'Support Resolution',
          icon: '🎧',
          dialogue: 'I see your payment of ₹4,200 went through successfully. Your updated receipt has just been emailed to you.'
        },
        {
          title: 'Appointment Confirm',
          icon: '📅',
          dialogue: 'Your consultation with our senior wealth advisor is confirmed for tomorrow at 3:30 PM IST.'
        },
        {
          title: 'Follow-up Nudge',
          icon: '🔔',
          dialogue: 'We noticed your quotation expires in 48 hours. Would you like me to connect you with your account executive?'
        }
      ],
      audio: {
        female: 'audio/English_female.mp3',
        male: 'audio/English_Male.mp3'
      }
    },
    {
      id: 'telugu',
      lang: 'Telugu',
      nativeScript: 'తెలుగు',
      region: 'Telangana & Andhra Pradesh',
      femaleName: 'Kavya',
      maleName: 'Suresh',
      tag: 'Hyderabad & Vijayawada Native',
      sampleText: {
        native: 'నమస్కారం! నేను డయలోరా నుండి మాట్లాడుతున్నాను. మీ ఆర్డర్ వివరాలు సరిచూడటానికి కాల్ చేశాను.',
        english: 'Namaskaram! I am speaking from Dialora. I have called to verify your order details.'
      },
      scenarios: [
        {
          title: 'Lead Follow-up',
          icon: '🏙️',
          dialogue: 'నమస్కారం! గచ్చిబౌలిలోని గేటెడ్ కమ్యూనిటీ విల్లా కోసం మీరు అడిగిన వివరాలు పంపడానికి కాల్ చేశాను.'
        },
        {
          title: 'Delivery Status',
          icon: '🚚',
          dialogue: 'మీ పార్సెల్ ఈరోజు సాయంత్రం 4 గంటలకి డెలివరీ చేయబడుతుంది. మీరు ఇంట్లో ఉంటారా?'
        },
        {
          title: 'Health Checkup',
          icon: '🩺',
          dialogue: 'రేపు ఉదయం 9:30 కి మీ డయాగ్నస్టిక్ టెస్ట్ అపాయింట్‌మెంట్ బుక్ అయింది.'
        },
        {
          title: 'Renewal Call',
          icon: '📋',
          dialogue: 'మీ పాలసీ ఈ నెలాఖరుతో ముగుస్తుంది. దయచేసి ఆన్‌లైన్ లో రెన్యూ చేసుకోండి.'
        }
      ],
      audio: {
        female: 'audio/Telugu_female.mp3',
        male: 'audio/Telugu_Male.mp3'
      }
    },
    {
      id: 'gujarati',
      lang: 'Gujarati',
      nativeScript: 'ગુજરાતી',
      region: 'Gujarat & Mumbai Diaspora',
      femaleName: 'Diya',
      maleName: 'Harsh',
      tag: 'Ahmedabad & Surat Merchant Tone',
      sampleText: {
        native: 'નમસ્તે! હું ડાયલોરાથી વાત કરું છું. તમારા બિઝનેસ માટે આઇડી તપાસવા માટે સંપર્ક કર્યો છે.',
        english: 'Namaste! I am calling from Dialora. I have contacted you to verify your business credentials.'
      },
      scenarios: [
        {
          title: 'Merchant Verification',
          icon: '🏦',
          dialogue: 'નમસ્તે જીતેશભાઈ! તમારા કરંટ એકાઉન્ટ માટે જરૂરી કેવાયસી લિંક મેં મોકલી આપી છે.'
        },
        {
          title: 'Order Dispatch',
          icon: '📦',
          dialogue: 'તમારો ઓર્ડર કાલે સુરતથી ડિસ્પેચ થશે. શું પેમેન્ટ કેશ ઓન ડિલિવરી રહેશે?'
        },
        {
          title: 'Service Call',
          icon: '🚗',
          dialogue: 'તમારી કાર સર્વિસિંગ આવતીકાલે સવારે 10 વાગ્યે શેડ્યૂલ કરવામાં આવી છે.'
        },
        {
          title: 'Invoice Notice',
          icon: '📑',
          dialogue: 'તમારું જીએસટી બિલ ઓનલાઇન જનરેટ થઈ ગયું છે, તપાસી લેશો.'
        }
      ],
      audio: {
        female: 'audio/Gujrati_female.mp3',
        male: 'audio/Gujrati_Male.mp3'
      }
    },
    {
      id: 'tamil',
      lang: 'Tamil',
      nativeScript: 'தமிழ்',
      region: 'Tamil Nadu & Chennai',
      femaleName: 'Ananya',
      maleName: 'Karthik',
      tag: 'Chennai & Coimbatore Inflection',
      sampleText: {
        native: 'வணக்கம்! நான் டயலோராவிலிருந்து பேசுகிறேன். உங்கள் விண்ணப்பத்தின் நிலையை உறுதிப்படுத்த அழைக்கிறேன்.',
        english: 'Vanakkam! I am speaking from Dialora to confirm your application status.'
      },
      scenarios: [
        {
          title: 'Customer Onboarding',
          icon: '🤝',
          dialogue: 'வணக்கம்! உங்கள் புதிய பிராட்பேண்ட் இணைப்பு நாளை மதியம் நிறுவப்படும்.'
        },
        {
          title: 'EMI Reminder',
          icon: '💳',
          dialogue: 'உங்கள் வாகனக் கடன் தவணை வருகிற 5ஆம் தேதி செலுத்தப்பட வேண்டும்.'
        },
        {
          title: 'Doctor Visit',
          icon: '🩺',
          dialogue: 'மருத்துவர் அப்பாயிண்ட்மென்ட் நாளை மாலை 6 மணிக்கு உறுதி செய்யப்பட்டுள்ளது.'
        },
        {
          title: 'Cart Recovery',
          icon: '🛍️',
          dialogue: 'உங்கள் கார்ட்டில் உள்ள பொருட்களுக்கு 10% தள்ளுபடி கூப்பன் தயார் நிலையில் உள்ளது.'
        }
      ],
      audio: {
        female: 'audio/Tamil_female.mp3',
        male: 'audio/Tamil_Male.mp3'
      }
    },
    {
      id: 'marathi',
      lang: 'Marathi',
      nativeScript: 'मराठी',
      region: 'Maharashtra, Mumbai & Pune',
      femaleName: 'Tanvi',
      maleName: 'Chinmay',
      tag: 'Pune & Mumbai Dialect',
      sampleText: {
        native: 'नमस्कार! मी डायलोरा मधून बोलत आहे. तुमच्या खात्याच्या पडताळणीसाठी हा कॉल केला आहे.',
        english: 'Namaskar! I am speaking from Dialora regarding your account verification.'
      },
      scenarios: [
        {
          title: 'Property Query',
          icon: '🏠',
          dialogue: 'नमस्कार! बाणेर येथील 2BHK फ्लॅटच्या माहितीसाठी आपण विनंती केली होती.'
        },
        {
          title: 'Payment Alert',
          icon: '💰',
          dialogue: 'आपला वीज बिल भरण्याचा आजचा शेवटचा दिवस आहे, कृपया लिंकवर क्लिक करा.'
        },
        {
          title: 'Technician Visit',
          icon: '🔧',
          dialogue: 'आमचे इंजिनिअर उद्या दुपारी 2 वाजता तुमच्या घरी भेट देतील.'
        },
        {
          title: 'Admission Desk',
          icon: '🎓',
          dialogue: 'पुढील शैक्षणिक वर्षाच्या प्रवेश प्रक्रियेसाठी समुपदेशन सत्र उपलब्ध आहे.'
        }
      ],
      audio: {
        female: 'audio/Marathi_female.mp3',
        male: 'audio/Marathi_Male.mp3'
      }
    },
    {
      id: 'kannada',
      lang: 'Kannada',
      nativeScript: 'ಕನ್ನಡ',
      region: 'Karnataka & Bengaluru',
      femaleName: 'Sahana',
      maleName: 'Darshan',
      tag: 'Bengaluru Tech & Mysuru Cadence',
      sampleText: {
        native: 'ನಮಸ್ಕಾರ! ನಾನು ಡಯಲೋರಾದಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ನಿಮ್ಮ ಸೇವೆಯ ವಿಚಾರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದೇನೆ.',
        english: 'Namaskara! I am speaking from Dialora regarding your requested service.'
      },
      scenarios: [
        {
          title: 'Apartment Booking',
          icon: '🏢',
          dialogue: 'ನಮಸ್ಕಾರ! ವೈಟ್‌ಫೀಲ್ಡ್ ಪ್ರಾಜೆಕ್ಟ್ ಭೇಟಿಗಾಗಿ ಶನಿವಾರ ಸಮಯ ನಿಗದಿ ಮಾಡೋಣವೇ?'
        },
        {
          title: 'Courier Confirm',
          icon: '📦',
          dialogue: 'ನಿಮ್ಮ ಡೆಲಿವರಿ ಇಂದು ಸಂಜೆ 5 ಗಂಟೆಯೊಳಗೆ ನಿಮ್ಮ ವಿಳಾಸಕ್ಕೆ ತಲುಪಲಿದೆ.'
        },
        {
          title: 'Service Renewal',
          icon: '⚡',
          dialogue: 'ನಿಮ್ಮ ಇಂಟರ್ನೆಟ್ ಯೋಜನೆ ಅವಧಿ ಮುಗಿಯುತ್ತಿದೆ, ಮರುಚಾರ್ಜ್ ಮಾಡಲು ಬಯಸುವಿರಾ?'
        },
        {
          title: 'Hospital Slot',
          icon: '🩺',
          dialogue: 'ವೈದ್ಯರ ಸಮಾಲೋಚನೆಗೆ ನಾಳೆ ಬೆಳಿಗ್ಗೆ 10:30ಕ್ಕೆ ಬುಕ್ ಮಾಡಲಾಗಿದೆ.'
        }
      ],
      audio: {
        female: 'audio/Kannada_female.mp3',
        male: 'audio/Kannada_Male.mp3'
      }
    },
    {
      id: 'malayalam',
      lang: 'Malayalam',
      nativeScript: 'മലയാളം',
      region: 'Kerala & Kochi',
      femaleName: 'Devika',
      maleName: 'Vishnu',
      tag: 'Kochi & Malabar Cadence',
      sampleText: {
        native: 'നമസ്കാരം! ഞാൻ ഡയലോറയിൽ നിന്നാണ് സംസാരിക്കുന്നത്. നിങ്ങളുടെ സേവന വിവരങ്ങൾക്കായി വിളിച്ചതാണ്.',
        english: 'Namaskaram! I am speaking from Dialora regarding your service details.'
      },
      scenarios: [
        {
          title: 'Travel Booking',
          icon: '✈️',
          dialogue: 'നമസ്കാരം! നിങ്ങളുടെ ഹോട്ടൽ ബുക്കിംഗ് വിജയകരമായി പൂർത്തിയായിട്ടുണ്ട്.'
        },
        {
          title: 'Insurance Nudge',
          icon: '🛡️',
          dialogue: 'നിങ്ങളുടെ ആരോഗ്യ ഇൻഷുറൻസ് പോളിസി അടുത്ത ആഴ്ച പുതുക്കേണ്ടതാണ്.'
        },
        {
          title: 'Order Status',
          icon: '🚚',
          dialogue: 'നിങ്ങളുടെ ഓർഡർ നാളെ കൊച്ചിയിൽ നിന്ന് ഡെലിവറി ചെയ്യപ്പെടുന്നതാണ്.'
        },
        {
          title: 'Lab Report',
          icon: '🧪',
          dialogue: 'നിങ്ങളുടെ മെഡിക്കൽ ടെസ്റ്റ് റിപ്പോർട്ട് വാട്സാപ്പിൽ അയച്ചിട്ടുണ്ട്.'
        }
      ],
      audio: {
        female: 'audio/Malayalam_female.mp3',
        male: 'audio/Malayalam_Male.mp3'
      }
    },
    {
      id: 'bengali',
      lang: 'Bengali',
      nativeScript: 'বাংলা',
      region: 'West Bengal & Kolkata',
      femaleName: 'Shreya',
      maleName: 'Sourav',
      tag: 'Kolkata Urban Accent',
      sampleText: {
        native: 'নমস্কার! আমি ডায়ালোরা থেকে বলছি। আপনার অর্ডারের বিষয়ে কথা বলতে ফোন করেছি।',
        english: 'Nomoshkar! I am speaking from Dialora to discuss your order verification.'
      },
      scenarios: [
        {
          title: 'Retail Order',
          icon: '🛍️',
          dialogue: 'নমস্কার! আপনার অনলাইন অর্ডারের ডেলিভারি লোকেশন কি সল্টলেক হবে?'
        },
        {
          title: 'Bank Verification',
          icon: '🏦',
          dialogue: 'আপনার সেভিংস অ্যাকাউন্টের কেওয়াইসি আপডেট করার জন্য একটি লিঙ্ক পাঠানো হয়েছে।'
        },
        {
          title: 'Course Admission',
          icon: '📚',
          dialogue: 'আগামীকালের কাউন্সেলিং সেশনের জন্য আপনার আসন সংরক্ষিত রয়েছে।'
        },
        {
          title: 'Broadband Setup',
          icon: '🌐',
          dialogue: 'আমাদের টেকনিশিয়ান কাল সকালে আপনার রাউটার ইন্সটল করতে আসবেন।'
        }
      ],
      audio: {
        female: 'audio/Bengali_female.mp3',
        male: 'audio/Bengali_Male.mp3'
      }
    },
    {
      id: 'odia',
      lang: 'Odia',
      nativeScript: 'ଓଡ଼ିଆ',
      region: 'Odisha & Bhubaneswar',
      femaleName: 'Smruti',
      maleName: 'Alok',
      tag: 'Bhubaneswar & Cuttack Regional',
      sampleText: {
        native: 'ନମସ୍କାର! ମୁଁ ଡାୟଲୋରାରୁ କହୁଛି। ଆପଣଙ୍କ ଅର୍ଡର ସୂଚନା ଯାଞ୍ଚ କରିବାକୁ କଲ୍ କରିଛି।',
        english: 'Namaskara! I am speaking from Dialora to verify your recent order.'
      },
      scenarios: [
        {
          title: 'Order Tracking',
          icon: '📦',
          dialogue: 'ନମସ୍କାର! ଆପଣଙ୍କ ପାର୍ସଲ ଆସନ୍ତାକାଲି ସୁଦ୍ଧା ପହଞ୍ଚିଯିବ।'
        },
        {
          title: 'Loan Reminder',
          icon: '💳',
          dialogue: 'ଆପଣଙ୍କ କିସ୍ତି ପରିଶୋଧ କରିବା ପାଇଁ ଲିଙ୍କ୍ ଏସ୍ଏମ୍ଏସ୍ କରାଯାଇଛି।'
        },
        {
          title: 'Clinic Notice',
          icon: '🩺',
          dialogue: 'ଡାକ୍ତରଙ୍କ ସହିତ ଆପଣଙ୍କ ପରାମର୍ଶ ସମୟ ସ୍ଥିର ହୋଇଛି।'
        },
        {
          title: 'Service Visit',
          icon: '⚙️',
          dialogue: 'ସର୍ଭିସ୍ ଇଞ୍ଜିନିୟର୍ ଆଜି ଅପରାହ୍ନରେ ଆପଣଙ୍କୁ ଯୋଗାଯୋଗ କରିବେ।'
        }
      ],
      audio: {
        female: 'audio/Odia_female.mp3',
        male: 'audio/Odia_Male.mp3'
      }
    }
  ];

  const currentPersona = personas.find(p => p.lang === selectedLang) || personas[0];
  const activeAudioPath = gender === 'female' ? currentPersona.audio.female : currentPersona.audio.male;

  // Handle Play/Pause for Master Player
  const togglePlayAudio = (specificAudioPath?: string) => {
    const targetPath = specificAudioPath || activeAudioPath;
    const baseUrl = import.meta.env.BASE_URL || '/';
    const fullAudioPath = targetPath.startsWith('/') 
      ? `${baseUrl}${targetPath.slice(1)}` 
      : `${baseUrl}${targetPath}`;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(fullAudioPath);
    audio.playbackRate = playbackSpeed;
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn("Audio play failed:", err);
      setIsPlaying(false);
    });
  };

  // Stop audio on unmount or language/gender change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [selectedLang, gender]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pt-28 pb-24 bg-[#080b11] text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-[#245ae2]/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
            <span className="text-xs font-semibold text-[#93c5fd] uppercase tracking-wider">
              India Voice AI Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Voices that sound, feel, and speak <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">like India</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Engineered with regional dialect fidelity, sub-500ms conversation turn-taking, and natural interruption recovery for high-scale enterprise calling.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="px-3 py-1.5 rounded-full bg-[#0d121f] border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d6f549]" />
              10+ Regional Indian Languages
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#0d121f] border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
              Sub-500ms Response Latency
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#0d121f] border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Full Duplex & Barge-in Ready
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* THE ELEVENLABS-INSPIRED MASTER AUDIO STUDIO CONSOLE          */}
      {/* ============================================================ */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        
        {/* Horizontal Language Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {personas.map((p) => {
            const isSelected = selectedLang === p.lang;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedLang(p.lang)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#245ae2] border-[#60a5fa] text-white shadow-[0_0_25px_rgba(36,90,226,0.5)] scale-105'
                    : 'bg-[#0d121f] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{p.lang}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                }`}>
                  {p.nativeScript}
                </span>
              </button>
            );
          })}
        </div>

        {/* Master Interactive Player Deck */}
        <div className="bg-[#0d121f] border border-[#245ae2]/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(36,90,226,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#245ae2]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Persona Info & Controls */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Persona Profile Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                      {gender === 'female' ? currentPersona.femaleName : currentPersona.maleName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#245ae2]/20 border border-[#245ae2]/40 text-xs font-semibold text-[#93c5fd]">
                      {currentPersona.lang}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {currentPersona.region} • {currentPersona.tag}
                  </p>
                </div>

                {/* Gender Toggle Pill */}
                <div className="inline-flex bg-[#080b11] rounded-full p-1 border border-white/10">
                  <button
                    onClick={() => setGender('female')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      gender === 'female'
                        ? 'bg-[#245ae2] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Female
                  </button>
                  <button
                    onClick={() => setGender('male')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      gender === 'male'
                        ? 'bg-[#245ae2] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Male
                  </button>
                </div>
              </div>

              {/* Spoken Dialogue Display Box */}
              <div className="bg-[#080b11] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <span>Spoken Script ({currentPersona.nativeScript})</span>
                  <span className="text-[#60a5fa]">{currentPersona.scenarios[activeScenarioIdx]?.title}</span>
                </div>
                
                <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
                  "{currentPersona.scenarios[activeScenarioIdx]?.dialogue || currentPersona.sampleText.native}"
                </p>

                <p className="text-xs text-slate-400 italic pt-2 border-t border-white/5">
                  Translation: "{currentPersona.sampleText.english}"
                </p>
              </div>

              {/* Interactive Phone Scenario Selector */}
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2.5">
                  Test Enterprise Scenarios:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {currentPersona.scenarios.map((sc, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActiveScenarioIdx(sIdx)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center gap-2 ${
                        activeScenarioIdx === sIdx
                          ? 'bg-[#245ae2]/20 border-[#245ae2] text-white'
                          : 'bg-[#080b11] border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{sc.icon}</span>
                      <span className="truncate">{sc.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: High-Tech Waveform Equalizer & Audio Deck */}
            <div className="lg:col-span-7 bg-[#080b11] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
              
              {/* Studio Status Bar */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#d6f549] animate-ping' : 'bg-slate-500'}`} />
                  <span className="text-slate-300 font-semibold">
                    {isPlaying ? 'STREAMING NEURAL AUDIO' : 'READY TO AUDITION'}
                  </span>
                </div>
                <div className="text-slate-500">
                  48kHz Studio Master • FLAC / MP3
                </div>
              </div>

              {/* Reactive Waveform Visualizer */}
              <div className="h-28 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center gap-1.5 px-4 overflow-hidden relative">
                {[...Array(36)].map((_, i) => {
                  const delay = `${(i * 0.04).toFixed(2)}s`;
                  return (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-200 origin-center ${
                        isPlaying
                          ? 'bg-gradient-to-t from-[#245ae2] via-[#60a5fa] to-[#d6f549] shadow-[0_0_10px_rgba(36,90,226,0.6)]'
                          : 'bg-white/10 h-2'
                      }`}
                      style={isPlaying ? {
                        height: `${Math.max(15, Math.sin(i * 0.5 + currentTime * 8) * 80 + 20)}%`,
                        animation: `pulse ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate ${delay}`
                      } : {}}
                    />
                  );
                })}
              </div>

              {/* Scrub / Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-[#245ae2] to-[#60a5fa] h-full rounded-full transition-all duration-150"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : (isPlaying ? 50 : 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || 12)}</span>
                </div>
              </div>

              {/* Bottom Transport Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {/* Master Play Button */}
                  <button
                    onClick={() => togglePlayAudio()}
                    className="flex items-center gap-3 bg-[#245ae2] hover:bg-[#1d4ed8] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-[0_0_30px_rgba(36,90,226,0.5)] hover:scale-105"
                  >
                    {isPlaying ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6" />
                        </svg>
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Play {currentPersona.lang} Sample</span>
                      </>
                    )}
                  </button>

                  {/* Playback Speed Pill */}
                  <button
                    onClick={() => {
                      const nextSpeed = playbackSpeed === 1.0 ? 1.25 : 1.0;
                      setPlaybackSpeed(nextSpeed);
                      if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
                    }}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-400 hover:text-white transition-all"
                  >
                    {playbackSpeed}x Speed
                  </button>
                </div>

                <Link
                  to="/demo"
                  className="text-xs font-semibold text-[#60a5fa] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  Call My Phone Live &rarr;
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ALL 10 REGIONAL VOICES LIBRARY (GRID ELEVATION)              */}
      {/* ============================================================ */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge className="mb-4">PAN-INDIA COVERAGE</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Audition all 10 native voice models
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Click any voice to hear instant studio audio. Tuned for natural vernacular speech without rigid robotic pauses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {personas.map((p) => {
            const isThisPlaying = isPlaying && selectedLang === p.lang;
            const targetAudio = gender === 'female' ? p.audio.female : p.audio.male;

            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedLang(p.lang);
                  togglePlayAudio(targetAudio);
                }}
                className={`bg-[#0d121f] border rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  isThisPlaying
                    ? 'border-[#245ae2] shadow-[0_0_30px_rgba(36,90,226,0.3)] bg-[#121929]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight">{p.lang}</h4>
                      <span className="text-xs font-medium text-slate-400">{p.nativeScript}</span>
                    </div>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isThisPlaying ? 'bg-[#245ae2] text-white shadow-lg' : 'bg-white/5 text-slate-300'
                    }`}>
                      {isThisPlaying ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-0.5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    "{p.sampleText.native}"
                  </p>
                </div>

                <div>
                  {/* Waveform snippet */}
                  <div className="flex items-center gap-1 h-5 mb-3">
                    {[...Array(16)].map((_, wIdx) => (
                      <span
                        key={wIdx}
                        className={`w-1 rounded-full transition-all ${
                          isThisPlaying
                            ? 'bg-[#60a5fa] h-4 animate-pulse'
                            : 'bg-white/10 h-1.5'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
                    <span>{gender === 'female' ? p.femaleName : p.maleName}</span>
                    <span className="text-[#93c5fd]">Listen &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* ENTERPRISE INTELLIGENCE & INFRASTRUCTURE PILLARS             */}
      {/* ============================================================ */}
      <section className="py-16 px-4 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#245ae2]/15 text-[#60a5fa] flex items-center justify-center font-bold text-lg mb-4">
              &lt;500ms
            </div>
            <h3 className="text-base font-bold text-white mb-2">Ultra-Low Turn Latency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Speaks immediately when the caller finishes, eliminating the awkward silence of traditional chatbots.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#245ae2]/15 text-[#60a5fa] flex items-center justify-center font-bold text-lg mb-4">
              🗣️
            </div>
            <h3 className="text-base font-bold text-white mb-2">Barge-In & Interruptions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Callers can cut in mid-sentence. Dialora listens actively and handles corrections seamlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#245ae2]/15 text-[#60a5fa] flex items-center justify-center font-bold text-lg mb-4">
              🇮🇳
            </div>
            <h3 className="text-base font-bold text-white mb-2">Hinglish Code-Switching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically alternates between Hindi and English phrases just like an authentic Indian tele-caller.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#245ae2]/15 text-[#60a5fa] flex items-center justify-center font-bold text-lg mb-4">
              📞
            </div>
            <h3 className="text-base font-bold text-white mb-2">Carrier Trunk Ready</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero telephony changes needed. Plugs straight into Exotel, Twilio, Plivo, and Tata Tele SIP trunks.
            </p>
          </div>
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}
