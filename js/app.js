/* ===== RED PIRATE - MAIN APP ===== */

// ===== STATE =====
const state = {
  cart: JSON.parse(localStorage.getItem('rp_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('rp_wishlist') || '[]'),
  finder: { age: null, budget: null, interests: [] },
  finderStep: 1,
  productsPage: 1,
  currentFilter: 'all'
};

// ===== FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyD8NqcFYCpUJ4wCLlPbUm7oxFvG_-Pgw3U",
  authDomain: "theredpirate-e1b39.firebaseapp.com",
  projectId: "theredpirate-e1b39",
  storageBucket: "theredpirate-e1b39.firebasestorage.app",
  messagingSenderId: "868585769746",
  appId: "1:868585769746:web:7c182ba2f1bba575fa41cb"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== DATA =====
const PRODUCTS = [
  { id: 'lego-city', name: 'LEGO City Police Station', emoji: '&#129307;', imageUrl: 'https://images.brickset.com/sets/images/60316-1.jpg', category: 'lego', price: 349, originalPrice: 449, rating: 4.8, reviews: 234, tags: ['sale','popular'], description: 'תחנת משטרה אינטראקטיבית עם 743 חלקים, 3 כלי רכב ו-6 דמויות. מגיל 7+.' },
  { id: 'barbie-dream', name: 'ברבי Dreamtopia', emoji: '&#128131;', imageUrl: 'https://www.franklinstoystore.com/cdn/shop/files/matlhlc28.jpg?v=1716707385', category: 'dolls', price: 129, originalPrice: 179, rating: 4.7, reviews: 187, tags: ['sale'], description: 'ברבי קסומה עם שיער ורוד, שמלת נסיכה ואביזרים. מגיל 3+.' },
  { id: 'rc-car', name: 'מכונית שלט 4×4 Off-Road', emoji: '&#128663;', imageUrl: 'https://ttoys-shop.myshopify.com/cdn/shop/products/product-image-975680680.jpg?v=1571741266', category: 'rc', price: 249, originalPrice: null, rating: 4.6, reviews: 98, tags: ['new'], description: 'מכונית שלט חוצות עם גלגלים עצומים, 4 הנעות ומהירות 25 קמ"ש. מגיל 8+.' },
  { id: 'paint-kit', name: 'ערכת ציור מקצועית 120 צבעים', emoji: '&#127912;', imageUrl: 'https://artcreativity.com/cdn/shop/products/medium_f06f9919-4fe3-491f-b783-26b85722b17f.jpg?v=1753742221', category: 'arts', price: 189, originalPrice: 249, rating: 4.9, reviews: 312, tags: ['popular','sale'], description: 'ערכת ציור מקיפה עם עפרונות צבעוניים, מרקרים, צבעי מים וקנבס. מגיל 6+.' },
  { id: 'coding-robot-jr', name: 'רובוט קידוד לילדים', emoji: '&#129302;', imageUrl: 'https://smartkidsplanet.com/cdn/shop/products/81ko3tEcuVL._AC_SL1500.jpg', category: 'educational', price: 299, originalPrice: 399, rating: 4.7, reviews: 145, tags: ['popular'], description: 'רובוט חכם שמלמד תכנות בצורה משחקית. תואם אפליקציית iOS/Android. מגיל 5+.' },
  { id: 'lego-technic', name: 'LEGO Technic Race Car', emoji: '&#127946;', imageUrl: 'https://images.brickset.com/sets/images/42096-1.jpg', category: 'lego', price: 499, originalPrice: 649, rating: 4.9, reviews: 89, tags: ['sale','popular'], description: 'מכונית מירוץ מפורטת עם מנוע פנימי פועל. 1,580 חלקים. מגיל 10+.' },
  { id: 'trampoline', name: 'טרמפולינה 3m עם רשת בטיחות', emoji: '&#127909;', imageUrl: 'https://jumpflyplay.com/cdn/shop/files/outdoor-trampoline-with-safety-enclosure-net-549692.jpg?v=1727262256', category: 'outdoor', price: 899, originalPrice: 1199, rating: 4.5, reviews: 67, tags: ['sale'], description: 'טרמפולינה ביתית עם רשת בטיחות, 8 רגליים ומשטח קפיץ איכותי. מגיל 6+.' },
  { id: 'puzzle-1000', name: 'פאזל 1000 חלקים - ירושלים', emoji: '&#129513;', imageUrl: 'https://cdn.unifiedcommerce.com/content/product/media/large/628136655507-main.webp', category: 'puzzles', price: 89, originalPrice: null, rating: 4.6, reviews: 203, tags: ['new'], description: 'פאזל פנורמי של ירושלים העתיקה, 1000 חלקים איכותיים. מגיל 12+.' },
  { id: 'baby-gym', name: 'שטיח פעילות לתינוק', emoji: '&#128118;', imageUrl: 'https://cdn.shopify.com/s/files/1/0614/5857/9639/files/Interactive-light-and-music-baby-play-mat-Baby-Sensory-Training-D-TM240-2.webp?v=1709694363', category: 'baby', price: 159, originalPrice: 199, rating: 4.8, reviews: 421, tags: ['popular'], description: 'שטיח פעילות מרופד עם 5 צעצועים תלויים, מוזיקה ואורות. 0-12 חודשים.' },
  { id: 'scooter-kids', name: 'קורקינט ילדים 3 גלגלים', emoji: '&#128692;', imageUrl: 'https://pyleusa.com/cdn/shop/files/HURFS96.jpg?v=1712779215', category: 'outdoor', price: 199, originalPrice: 269, rating: 4.7, reviews: 156, tags: ['sale','new'], description: 'קורקינט יציב ובטוח עם 3 גלגלים, גובה מתכוונן ובלם. מגיל 2+.' },
  { id: 'playdoh-mega', name: 'Play-Doh מגה סט 36 צבעים', emoji: '&#127774;', imageUrl: 'https://exceedtoystore.com/cdn/shop/products/81ILBgBAo6L._AC_SL1500.jpg?v=1656068782', category: 'arts', price: 119, originalPrice: 149, rating: 4.6, reviews: 278, tags: ['popular'], description: '36 קופסאות פלאי-דו בצבעים שונים + 10 כלי יצירה. לא רעיל ובטוח לילדים. מגיל 2+.' },
  { id: 'monopoly-he', name: 'מונופול ישראל מהדורה חדשה', emoji: '&#127921;', imageUrl: 'https://www.maziply.com/cdn/shop/files/monopoly-board-game-packaging-front_grande.jpg?v=1762452079', category: 'puzzles', price: 149, originalPrice: null, rating: 4.5, reviews: 189, tags: ['new'], description: 'מונופול עם ערים ישראליות, שטרות מעוצבים ולוח מאויר יפה. מגיל 8+.' }
];

const BRANCHES = [
  { id: 'tlv', name: 'תל אביב', area: 'center', emoji: '&#127961;', sub: 'רחוב דיזנגוף 50', address: 'דיזנגוף 50, תל אביב', phone: '03-555-1234', hours: 'א-ה: 09:00-21:00 | ו: 09:00-14:00', parking: 'חניון דיזנגוף סנטר', mapUrl: 'https://maps.google.com' },
  { id: 'jlm', name: 'ירושלים', area: 'center', emoji: '&#127963;', sub: 'קניון מלחה', address: 'קניון מלחה, ירושלים', phone: '02-555-5678', hours: 'א-ה: 09:00-21:00 | ו: 09:00-13:00', parking: 'חניון חינם', mapUrl: 'https://maps.google.com' },
  { id: 'hfa', name: 'חיפה', area: 'north', emoji: '&#9973;&#65039;', sub: 'קניון הכרמל', address: 'קניון הכרמל, חיפה', phone: '04-555-9012', hours: 'א-ה: 09:00-21:00 | ו: 09:00-14:00', parking: 'חניון הקניון', mapUrl: 'https://maps.google.com' },
  { id: 'bs', name: 'באר שבע', area: 'south', emoji: '&#127964;', sub: 'קניון גרנד', address: 'קניון גרנד, באר שבע', phone: '08-555-3456', hours: 'א-ה: 09:00-21:00 | ו: 09:00-14:00', parking: 'חניון חינם', mapUrl: 'https://maps.google.com' },
  { id: 'pt', name: 'פתח תקווה', area: 'center', emoji: '&#127970;', sub: 'קניון הגדול', address: 'קניון הגדול, פתח תקווה', phone: '03-555-7890', hours: 'א-ה: 09:00-21:00 | ו: 09:00-14:00', parking: 'חניון בניין', mapUrl: 'https://maps.google.com' },
  { id: 'rl', name: 'ראשון לציון', area: 'center', emoji: '&#127962;', sub: 'קניון הזהב', address: 'קניון הזהב, ראשון לציון', phone: '03-555-2345', hours: 'א-ה: 09:00-21:00 | ו: 09:00-14:00', parking: 'חניון הקניון', mapUrl: 'https://maps.google.com' },
  { id: 'asd', name: 'אשדוד', area: 'south', emoji: '&#127745;', sub: 'קניון לב אשדוד', address: 'קניון לב אשדוד', phone: '08-555-6789', hours: 'א-ה: 09:00-21:00 | ו: 09:00-14:00', parking: 'חניה חופשית', mapUrl: 'https://maps.google.com' },
  { id: 'nat', name: 'נתניה', area: 'center', emoji: '&#127754;', sub: 'קניון עיר ימים', address: 'קניון עיר ימים, נתניה', phone: '09-555-1122', hours: 'א-ה: 09:00-21:00 | ו: 09:00-14:00', parking: 'חניון קניון', mapUrl: 'https://maps.google.com' }
];

const GIFT_DB = {
  '0-2': {
    '50-100': [
      { name: 'קובייה מוזיקלית', emoji: '&#127925;', price: '₪89', reason: 'מפתח שמיעה וקואורדינציה' },
      { name: 'רעשן צבעוני לתינוק', emoji: '&#127881;', price: '₪59', reason: 'מגרה את החושים בגיל הרך' },
      { name: 'ספר בד רך', emoji: '&#128218;', price: '₪69', reason: 'מפתח שפה ודמיון' },
      { name: 'כדור תינוקות רך', emoji: '&#9917;', price: '₪49', reason: 'בטוח ומהנה לתינוקות' }
    ],
    '100-200': [
      { name: 'שטיח פעילות לתינוק', emoji: '&#128118;', price: '₪159', reason: 'מושלם לגיל 0-2, מעורר חושים' },
      { name: 'בובת בד רכה', emoji: '&#129523;', price: '₪119', reason: 'בטוחה לתינוקות, לבד אורגני' },
      { name: 'מתקן שיניים + טבעות', emoji: '&#128578;', price: '₪139', reason: 'עוזר בזמן בקיעת שיניים' },
      { name: 'ספרי אמבטיה גומי', emoji: '&#128704;', price: '₪99', reason: 'כיף בכל שטיפה' }
    ],
    '200-400': [
      { name: 'מרכז פעילות Walker', emoji: '&#128693;', price: '₪349', reason: 'מעורר התפתחות מוטורית' },
      { name: 'סט אמבטיה + צעצועים', emoji: '&#128703;', price: '₪249', reason: 'כיף בכל שטיפה' },
      { name: 'נדנדה חשמלית לתינוק', emoji: '&#129681;', price: '₪299', reason: 'מרגיעה ומשעשעת' },
      { name: 'מוביל תינוק עם אביזרים', emoji: '&#128118;', price: '₪379', reason: 'נוחות ובטיחות בתנועה' }
    ],
    '400+': [
      { name: 'כורסת פעילות מוזיקלית', emoji: '&#129681;', price: '₪499', reason: 'מעורר כל החושים' },
      { name: 'מכונת נסיעה חשמלית', emoji: '&#128663;', price: '₪799', reason: 'חוויה מהנה לתינוק' },
      { name: 'כסא אכילה מתכוונן', emoji: '&#127860;', price: '₪449', reason: 'נוחות לשנים רבות' },
      { name: 'מיטת תינוק + מובייל', emoji: '&#128704;', price: '₪699', reason: 'שינה בטוחה ומרגיעה' }
    ]
  },
  '3-5': {
    '50-100': [
      { name: 'Play-Doh סט יצירה', emoji: '&#127774;', price: '₪89', reason: 'מפתח יצירתיות ומוטוריקה' },
      { name: 'פאזל 48 חלקים', emoji: '&#129513;', price: '₪69', reason: 'מתאים לגיל 3-5' },
      { name: 'צבעי אצבעות', emoji: '&#127912;', price: '₪59', reason: 'יצירה מהנה ובטוחה' },
      { name: 'משחק זיכרון חיות', emoji: '&#129421;', price: '₪79', reason: 'מחזק זיכרון וריכוז' }
    ],
    '100-200': [
      { name: 'LEGO Duplo Classic', emoji: '&#129307;', price: '₪149', reason: 'בלוקים גדולים לגיל הרך' },
      { name: 'ערכת מטבח לילדים', emoji: '&#127859;', price: '₪179', reason: 'משחק תפקידים מהנה' },
      { name: 'אופניים 12 אינץ', emoji: '&#128690;', price: '₪169', reason: 'ספורט ותנועה בגיל צעיר' },
      { name: 'ארגז חול וכלים', emoji: '&#127958;', price: '₪129', reason: 'שעות של משחק בחוץ' }
    ],
    '200-400': [
      { name: 'בית בובות עץ', emoji: '&#127968;', price: '₪349', reason: 'משחק דמיון מפותח' },
      { name: 'LEGO Friends Starter', emoji: '&#129307;', price: '₪229', reason: 'בנייה ודמיון' },
      { name: 'אוהל משחק + מנהרה', emoji: '&#9978;', price: '₪279', reason: 'הרפתקאות בבית' },
      { name: 'ערכת רופא לילדים', emoji: '&#129657;', price: '₪199', reason: 'משחק תפקידים יצירתי' }
    ],
    '400+': [
      { name: 'ברבי Dream House', emoji: '&#127968;', price: '₪549', reason: 'עולם שלם לברבי' },
      { name: 'קורקינט ילדים 3 גלגלים', emoji: '&#128692;', price: '₪199', reason: 'בטוח לגיל הרך' },
      { name: 'אופניים חשמליים לילדים', emoji: '&#128690;', price: '₪699', reason: 'כיף ובטוח לגיל 3+' },
      { name: 'מגרש חול + גלשן', emoji: '&#127958;', price: '₪499', reason: 'פארק אטרקציות בחצר' }
    ]
  },
  '6-8': {
    '50-100': [
      { name: 'מונופול ג\'וניור', emoji: '&#127921;', price: '₪89', reason: 'משחק קלאסי לגיל הזה' },
      { name: 'ערכת ציור 60 צבעים', emoji: '&#127912;', price: '₪79', reason: 'מפתח אמנות ויצירתיות' },
      { name: 'חרב ומגן פיראטים', emoji: '&#9876;', price: '₪69', reason: 'משחק הרפתקאות מהנה' },
      { name: 'פאזל 200 חלקים', emoji: '&#129513;', price: '₪59', reason: 'אתגר מחשבתי לגיל 6+' }
    ],
    '100-200': [
      { name: 'LEGO City Police', emoji: '&#129307;', price: '₪149', reason: 'הכי פופולרי בגיל 6-8' },
      { name: 'מכונית שלט 4x4', emoji: '&#128663;', price: '₪189', reason: 'כיף לילדים פעילים' },
      { name: 'ערכת מדע ניסויים', emoji: '&#129514;', price: '&#9994;', price: '₪139', reason: 'מדע מגניב בבית' },
      { name: 'אופניים 20 אינץ', emoji: '&#128690;', price: '₪179', reason: 'עצמאות ותנועה' }
    ],
    '200-400': [
      { name: 'LEGO Star Wars', emoji: '&#129307;', price: '₪349', reason: 'חוויית בנייה עשירה' },
      { name: 'רובוט קידוד', emoji: '&#129302;', price: '₪299', reason: 'מלמד תכנות בכיף' },
      { name: 'מיקרוסקופ לילדים', emoji: '&#128300;', price: '₪249', reason: 'חוקר טבע אמיתי' },
      { name: 'ערכת בנייה מגנטית', emoji: '&#129517;', price: '₪229', reason: 'פיזיקה וחשיבה יצירתית' }
    ],
    '400+': [
      { name: 'קורקינט חשמלי', emoji: '&#128692;', price: '₪799', reason: 'חוויית רכיבה מהנה' },
      { name: 'LEGO Technic Super', emoji: '&#129307;', price: '₪499', reason: 'בנייה מורכבת ומגרה' },
      { name: 'טבלט לימודי לילדים', emoji: '&#128250;', price: '₪649', reason: 'למידה ובידור בטאבלט' },
      { name: 'טרמפולינה ביתית', emoji: '&#127909;', price: '₪899', reason: 'ספורט ופעילות גופנית' }
    ]
  },
  '9-12': {
    '50-100': [
      { name: 'פאזל 1000 חלקים', emoji: '&#129513;', price: '₪89', reason: 'אתגר מתאים לגיל' },
      { name: 'משחק קלפים אסטרטגי', emoji: '&#127921;', price: '₪79', reason: 'מפתח חשיבה אסטרטגית' },
      { name: 'ערכת ציור מקצועית', emoji: '&#127912;', price: '₪99', reason: 'לאמנים צעירים' },
      { name: 'ספר ניסויים מדעיים', emoji: '&#129514;', price: '₪69', reason: 'מדע מגניב ומהנה' }
    ],
    '100-200': [
      { name: 'ערכת מדע וניסויים', emoji: '&#129514;', price: '₪149', reason: 'מדע מהנה בבית' },
      { name: 'מכונית שלט 4x4', emoji: '&#128663;', price: '₪189', reason: 'אקשן ומהירות' },
      { name: 'ערכת הרכבת שעון', emoji: '&#9200;', price: '₪159', reason: 'פיתוח מיומנויות ידניות' },
      { name: 'מכשיר קריוקי', emoji: '&#127908;', price: '₪179', reason: 'בידור ושירה לכל המשפחה' }
    ],
    '200-400': [
      { name: 'LEGO Architecture', emoji: '&#129307;', price: '₪329', reason: 'בנייה ברמה גבוהה' },
      { name: 'ערכת אסטרונומיה', emoji: '&#127760;', price: '₪299', reason: 'חקר החלל מהבית' },
      { name: 'רובוט תכנות מתקדם', emoji: '&#129302;', price: '₪349', reason: 'STEM ותכנות' },
      { name: 'ערכת כימיה לנוער', emoji: '&#129514;', price: '₪279', reason: 'ניסויים מדעיים מרתקים' }
    ],
    '400+': [
      { name: 'טלסקופ מקצועי', emoji: '&#128301;', price: '₪699', reason: 'לחובבי האסטרונומיה' },
      { name: 'קורקינט חשמלי', emoji: '&#128692;', price: '₪799', reason: 'חוויית ספורט אמיתית' },
      { name: 'מצלמה דיגיטלית לנוער', emoji: '&#128247;', price: '₪599', reason: 'לצלמים צעירים' },
      { name: 'מדפסת תלת-מימד מיני', emoji: '&#129520;', price: '₪899', reason: 'יצירה בטכנולוגיה עתידנית' }
    ]
  },
  '13+': {
    '50-100': [
      { name: 'משחק לוח אסטרטגי', emoji: '&#127921;', price: '₪89', reason: 'מתאים לגיל 13+' },
      { name: 'ערכת איורים ועיצוב', emoji: '&#127912;', price: '₪99', reason: 'לאוהבי עיצוב גרפי' },
      { name: 'ספר קוסמות ולמידה', emoji: '&#129497;', price: '₪79', reason: 'כישרון קסמים מרשים' },
      { name: 'ערכת אוריגמי מתקדם', emoji: '&#129534;', price: '₪69', reason: 'אמנות יפנית מרגיעה' }
    ],
    '100-200': [
      { name: 'ערכת רובוטיקה מתקדמת', emoji: '&#129302;', price: '₪199', reason: 'STEM לבני נוער' },
      { name: 'לוח גרפי דיגיטלי', emoji: '&#128241;', price: '₪179', reason: 'לאמנים דיגיטליים' },
      { name: 'אוזניות גיימינג', emoji: '&#127911;', price: '₪149', reason: 'חוויית גיימינג מושלמת' },
      { name: 'ערכת קידוד Arduino', emoji: '&#129302;', price: '₪169', reason: 'צעד ראשון בהנדסה' }
    ],
    '200-400': [
      { name: 'LEGO Ideas מורכב', emoji: '&#129307;', price: '₪389', reason: 'בנייה ברמה מתקדמת' },
      { name: 'ערכת מוזיקה - גיטרה', emoji: '&#127928;', price: '₪349', reason: 'ללמוד מוזיקה' },
      { name: 'VR Headset לנוער', emoji: '&#129504;', price: '₪299', reason: 'מציאות מדומה מרתקת' },
      { name: 'ערכת צילום מקצועית', emoji: '&#128247;', price: '₪379', reason: 'לצלמים מתחילים ברצינות' }
    ],
    '400+': [
      { name: 'קורקינט חשמלי Pro', emoji: '&#128692;', price: '₪899', reason: 'מהירות 24 קמ"ש' },
      { name: 'מצלמת אקשן GoPro', emoji: '&#128247;', price: '₪799', reason: 'לבני נוער פעילים' },
      { name: 'כלי נגינה - יוקולילה', emoji: '&#127928;', price: '₪499', reason: 'קל ללמידה ומגניב' },
      { name: 'מחשב נייד לנוער', emoji: '&#128187;', price: '₪1,499', reason: 'ללמידה ויצירה דיגיטלית' }
    ]
  }
};

// ===== FIRESTORE =====
async function loadProductsFromFirestore() {
  try {
    const snapshot = await db.collection('products').orderBy('order').get();
    if (!snapshot.empty) {
      const staticImages = {};
      PRODUCTS.forEach(p => { if (p.imageUrl) staticImages[p.id] = p.imageUrl; });
      PRODUCTS.length = 0;
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (!data.imageUrl && staticImages[data.id]) data.imageUrl = staticImages[data.id];
        PRODUCTS.push(data);
      });
    }
  } catch (e) {
    console.warn('Firestore: using local data', e);
  }
}

async function updateProductStock(productId, newStock) {
  await db.collection('products').doc(productId).update({ stock: newStock });
}

async function populateFirestore() {
  const batch = db.batch();
  PRODUCTS.forEach((p, i) => {
    const ref = db.collection('products').doc(p.id);
    batch.set(ref, { ...p, stock: 10, order: i });
  });
  await batch.commit();
  console.log('Firestore populated!');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadProductsFromFirestore();
  renderProducts();
  renderBranches();
  initSwiper();
  initScrollEffects();
  startDealTimers();
  updateCartUI();
  animateTreasureChest();
  updateAuthUI(getCurrentUser());
});

// ===== PRODUCTS =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  let prods = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.tags.includes(filter));
  prods = prods.slice(0, 8);
  grid.innerHTML = prods.map(productCard).join('');
  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
    card.classList.add('fade-in');
  });
}

function productCard(p) {
  const badges = p.tags.map(t => `<span class="badge badge-${t}">${t === 'sale' ? 'מבצע' : t === 'new' ? 'חדש' : 'פופולרי'}</span>`).join('');
  const priceHtml = p.originalPrice
    ? `<span class="price-current">₪${p.price}</span><span class="price-original">₪${p.originalPrice}</span><span class="price-save">-${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>`
    : `<span class="price-current">₪${p.price}</span>`;
  const stars = '&#9733;'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '&#9734;' : '');
  const inWishlist = state.wishlist.includes(p.id);
  return `
    <div class="product-card" data-id="${p.id}" data-tags="${p.tags.join(',')}">
      <div class="product-image">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="product-img" />` : p.emoji ? `<span>${p.emoji}</span>` : `<span style="font-size:48px;opacity:0.2">📦</span>`}
        <div class="product-badges">${badges}</div>
        <button class="product-wishlist ${inWishlist ? 'active' : ''}" onclick="toggleWishlist('${p.id}', this)" title="שמור למועדפים">
          <i class="fa${inWishlist ? 's' : 'r'} fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${getCategoryName(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="count">(${p.reviews})</span>
        </div>
        <div class="product-prices">${priceHtml}</div>
        <div class="product-actions">
          <button class="btn-add-cart" onclick="addToCart('${p.id}', '${p.name}', ${p.price})">
            <i class="fas fa-cart-plus"></i> הוסף לעגלה
          </button>
          <button class="btn-quick-view" onclick="quickView('${p.id}')" title="תצוגה מהירה">
            <i class="fas fa-eye"></i>
          </button>
        </div>
        ${p.stock !== undefined ? `<div class="product-stock ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}">${p.stock > 0 ? `<i class="fas fa-check-circle"></i> במלאי (${p.stock})` : '<i class="fas fa-times-circle"></i> אזל מהמלאי'}</div>` : ''}
        <button class="btn-check-stock" onclick="scrollToInventory('${p.name}')">
          <i class="fas fa-warehouse"></i> בדוק מלאי בסניף
        </button>
      </div>
    </div>`;
}

function getCategoryName(cat) {
  const map = { lego: 'LEGO', dolls: 'בובות ודמויות', outdoor: 'חוץ וספורט', rc: 'שלט רחוק', arts: 'יצירה', educational: 'חינוכי', puzzles: 'פאזלים', baby: 'תינוקות', other: 'אחר' };
  return map[cat] || cat;
}

function filterProducts(filter, btn) {
  state.currentFilter = filter;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(filter);
}

function filterByCategory(cat) {
  scrollToSection('products');
  const grid = document.getElementById('productsGrid');
  const prods = PRODUCTS.filter(p => p.category === cat);
  grid.innerHTML = prods.map(productCard).join('');
  showToast(`מציג קטגוריה: ${getCategoryName(cat)}`);
}

function loadMoreProducts() {
  const grid = document.getElementById('productsGrid');
  const more = [
    { id: 'extra1', name: 'חרב ומגן פיראט', emoji: '&#9876;&#65039;', imageUrl: 'https://www.melissaanddoug.com/cdn/shop/products/Pirate-Costume-Role-Play-Set-004848-1-Pieces-Out.jpg', category: 'dolls', price: 79, originalPrice: 99, rating: 4.3, reviews: 56, tags: ['sale'], description: 'סט תחפושת פיראטים כולל חרב, מגן וכובע.' },
    { id: 'extra2', name: 'אוהל משחק ילדים', emoji: '&#9978;&#65039;', imageUrl: 'https://www.funlittletoys.com/cdn/shop/products/18-pcs-kids-pop-up-tent-camping-set-516802.jpg?v=1674003025', category: 'outdoor', price: 149, originalPrice: null, rating: 4.5, reviews: 88, tags: ['new'], description: 'אוהל קמפינג לילדים לשימוש בחוץ ובבית.' },
    { id: 'extra3', name: 'מיקרוסקופ לילדים', emoji: '&#128300;', imageUrl: 'https://constructiveplaythings.com/cdn/shop/products/bat-995_cpx-1001_007.jpg?v=1687979318', category: 'educational', price: 199, originalPrice: 259, rating: 4.7, reviews: 112, tags: ['popular'], description: 'מיקרוסקופ אמיתי עם 300x הגדלה. מגיל 8+.' },
    { id: 'extra4', name: 'כלי נגינה לתינוק', emoji: '&#127925;', imageUrl: 'https://constructiveplaythings.com/cdn/shop/files/hae-804_001.jpg', category: 'baby', price: 99, originalPrice: 129, rating: 4.6, reviews: 201, tags: ['sale'], description: 'סט 8 כלי נגינה צבעוניים לגיל הרך.' }
  ];
  more.forEach(p => { if (!PRODUCTS.find(x => x.id === p.id)) PRODUCTS.push(p); });
  grid.innerHTML += more.map(productCard).join('');
  showToast('&#10003; נטענו מוצרים נוספים!');
}

function quickView(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const priceHtml = p.originalPrice
    ? `<del style="color:var(--gray);font-size:16px">₪${p.originalPrice}</del> <span style="color:var(--red);font-size:30px;font-weight:900">₪${p.price}</span>`
    : `<span style="color:var(--red);font-size:30px;font-weight:900">₪${p.price}</span>`;
  document.getElementById('productModalContent').innerHTML = `
    <div class="modal-product-image">${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />` : p.emoji ? p.emoji : '📦'}</div>
    <div class="product-category" style="color:var(--red);font-weight:600;margin-bottom:6px">${getCategoryName(p.category)}</div>
    <div class="modal-product-name">${p.name}</div>
    <div class="modal-product-desc">${p.description}</div>
    <div class="modal-product-price">${priceHtml}</div>
    <button class="btn-primary" onclick="addToCart('${p.id}','${p.name}',${p.price});closeModal('productModal')">
      <i class="fas fa-cart-plus"></i> הוסף לעגלה
    </button>
    <button class="btn-outline" style="margin-top:10px" onclick="scrollToInventory('${p.name}');closeModal('productModal')">
      <i class="fas fa-warehouse"></i> בדוק מלאי בסניף
    </button>`;
  openModal('productModal');
}

// ===== CART =====
function addToCart(id, name, price) {
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    const prod = PRODUCTS.find(p => p.id === id);
    state.cart.push({ id, name, price, qty: 1, emoji: prod ? prod.emoji : '&#127873;' });
  }
  saveCart();
  updateCartUI();
  openCart();
  showToast(`&#10003; ${name} נוסף לעגלה!`, 'success');
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

function saveCart() { localStorage.setItem('rp_cart', JSON.stringify(state.cart)); }

function updateCartUI() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (state.cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>העגלה שלך ריקה</p><button class="btn-primary" onclick="closeCart()">המשך קנייה</button></div>`;
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">₪${item.price * item.qty}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash-alt"></i></button>
      </div>`).join('');
    footerEl.style.display = 'block';
    document.getElementById('cartTotal').textContent = `₪${total}`;
  }
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function checkout() {
  state.cart = [];
  saveCart();
  updateCartUI();
  closeCart();
  showToast('&#127881; הזמנה בוצעה בהצלחה! תודה על הקנייה!', 'success');
}

// ===== WISHLIST =====
function toggleWishlist(id, btn) {
  const idx = state.wishlist.indexOf(id);
  if (idx === -1) {
    state.wishlist.push(id);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast('&#10084;&#65039; נוסף למועדפים!');
  } else {
    state.wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast('הוסר מהמועדפים');
  }
  localStorage.setItem('rp_wishlist', JSON.stringify(state.wishlist));
}

// ===== GIFT FINDER =====
function selectAge(age, btn) {
  document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.finder.age = age;
  setTimeout(() => goToStep(2), 400);
}

function selectBudget(budget, btn) {
  document.querySelectorAll('.budget-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.finder.budget = budget;
  setTimeout(() => goToStep(3), 400);
}

function toggleInterest(interest, btn) {
  btn.classList.toggle('selected');
  const idx = state.finder.interests.indexOf(interest);
  if (idx === -1) state.finder.interests.push(interest);
  else state.finder.interests.splice(idx, 1);
  const findBtn = document.getElementById('findGiftBtn');
  findBtn.disabled = state.finder.interests.length === 0;
}

function goToStep(step) {
  state.finderStep = step;
  document.querySelectorAll('.finder-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');
  const progress = { 1: 33, 2: 66, 3: 100 };
  document.getElementById('progressFill').style.width = progress[step] + '%';
  document.getElementById('progressText').textContent = `שלב ${step} מתוך 3`;
}

function findMatchingProduct(giftName) {
  const name = giftName.toLowerCase();
  return PRODUCTS.find(p => {
    const pName = p.name.toLowerCase();
    if (pName === name) return true;
    const words = name.split(/\s+/).filter(w => w.length > 2);
    return words.some(w => pName.includes(w));
  });
}

function findGifts() {
  const { age, budget } = state.finder;
  const results = GIFT_DB[age]?.[budget] || [];
  document.getElementById('giftResults').innerHTML = results.length
    ? results.map(r => {
        const match = findMatchingProduct(r.name);
        if (match) {
          const img = match.imageUrl
            ? `<img src="${match.imageUrl}" alt="${match.name}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;">`
            : `<span style="font-size:32px">${match.emoji}</span>`;
          return `
            <div class="gift-result-item" onclick="quickView('${match.id}')" style="cursor:pointer">
              <div class="gift-result-emoji">${img}</div>
              <div class="gift-result-info">
                <h4>${match.name}</h4>
                <p>${r.reason}</p>
              </div>
              <div class="gift-result-price" style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
                <span>₪${match.price}</span>
                <button onclick="event.stopPropagation();addToCart('${match.id}','${match.name}',${match.price})" style="background:var(--red);color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;font-weight:600">+ עגלה</button>
              </div>
            </div>`;
        }
        return `
          <div class="gift-result-item" onclick="addGiftToCart('${r.name}',${parseInt(r.price.replace(/[^\d]/g,''))})">
            <div class="gift-result-emoji">${r.emoji}</div>
            <div class="gift-result-info">
              <h4>${r.name}</h4>
              <p>${r.reason}</p>
            </div>
            <div class="gift-result-price">${r.price}</div>
          </div>`;
      }).join('')
    : '<p style="color:var(--gray);text-align:center;padding:20px">לא נמצאו תוצאות. נסה סינון אחר.</p>';
  document.querySelectorAll('.finder-step').forEach(s => s.classList.remove('active'));
  document.getElementById('stepResults').classList.add('active');
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('progressText').textContent = 'נמצאו המלצות!';
}

function addGiftToCart(name, price) {
  addToCart('gift-' + Date.now(), name, price || 150);
}

function resetFinder() {
  state.finder = { age: null, budget: null, interests: [] };
  state.finderStep = 1;
  document.querySelectorAll('.age-btn, .budget-btn, .interest-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('findGiftBtn').disabled = true;
  goToStep(1);
}

// ===== INVENTORY =====
function checkInventory() {
  const product = document.getElementById('inventorySearch').value.trim();
  const branch = document.getElementById('branchSelect').value;
  const result = document.getElementById('inventoryResult');
  if (!product || !branch) {
    showToast('נא למלא שם מוצר וסניף', 'error');
    return;
  }
  result.classList.remove('hidden', 'in-stock', 'out-stock');
  result.classList.add('loading');
  result.innerHTML = '<i class="fas fa-spinner fa-spin"></i> בודק מלאי...';
  setTimeout(() => {
    const inStock = Math.random() > 0.3;
    const qty = inStock ? Math.floor(Math.random() * 15) + 1 : 0;
    const branchName = BRANCHES.find(b => b.id === branch)?.name || branch;
    result.classList.remove('loading');
    if (inStock) {
      result.classList.add('in-stock');
      result.innerHTML = `<i class="fas fa-check-circle"></i> <strong>${product}</strong> זמין בסניף ${branchName} – ${qty} יחידות במלאי!`;
    } else {
      result.classList.add('out-stock');
      result.innerHTML = `<i class="fas fa-times-circle"></i> <strong>${product}</strong> אינו זמין כרגע בסניף ${branchName}. בדוק סניף אחר.`;
    }
  }, 1400);
}

function scrollToInventory(productName) {
  scrollToSection('inventory');
  setTimeout(() => {
    const input = document.getElementById('inventorySearch');
    if (input) { input.value = productName; input.focus(); }
  }, 600);
}

// ===== BRANCHES =====
function renderBranches(areaFilter = 'all') {
  const grid = document.getElementById('branchesGrid');
  const filtered = areaFilter === 'all' ? BRANCHES : BRANCHES.filter(b => b.area === areaFilter);
  grid.innerHTML = filtered.map(b => `
    <div class="branch-card">
      <div class="branch-header">
        <div class="branch-emoji">${b.emoji}</div>
        <h3>${b.name}</h3>
        <span>${b.sub}</span>
      </div>
      <div class="branch-body">
        <div class="branch-info-row"><i class="fas fa-map-marker-alt"></i><span>${b.address}</span></div>
        <div class="branch-info-row"><i class="fas fa-phone"></i><span>${b.phone}</span></div>
        <div class="branch-info-row"><i class="fas fa-clock"></i><span>${b.hours}</span></div>
        <div class="branch-info-row"><i class="fas fa-parking"></i><span>${b.parking}</span></div>
      </div>
      <div class="branch-actions">
        <button class="btn-branch btn-branch-primary" onclick="window.open('${b.mapUrl}','_blank')">
          <i class="fas fa-directions"></i> ניווט
        </button>
        <button class="btn-branch btn-branch-secondary" onclick="checkBranchStock('${b.id}','${b.name}')">
          <i class="fas fa-warehouse"></i> מלאי
        </button>
      </div>
    </div>`).join('');
}

function filterBranches(area, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBranches(area);
}

function checkBranchStock(branchId, branchName) {
  scrollToSection('inventory');
  setTimeout(() => {
    document.getElementById('branchSelect').value = branchId;
    showToast(`בודק מלאי בסניף ${branchName}...`);
  }, 600);
}

// ===== SEARCH =====
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
  }
}

function handleSearch(e) {
  if (e.key === 'Enter') { performSearch(); return; }
  const q = e.target.value.toLowerCase().trim();
  const dropdown = document.getElementById('searchResults');
  if (q.length < 2) { dropdown.innerHTML = ''; return; }
  const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || getCategoryName(p.category).toLowerCase().includes(q)).slice(0, 5);
  dropdown.innerHTML = results.map(p => `
    <div class="search-result-item" onclick="quickView('${p.id}')">
      <span class="result-emoji">${p.emoji}</span>
      <div class="result-info">
        <strong>${p.name}</strong>
        <span>₪${p.price} | ${getCategoryName(p.category)}</span>
      </div>
    </div>`).join('') || `<div class="search-result-item"><div class="result-info"><strong>לא נמצאו תוצאות עבור "${q}"</strong></div></div>`;
}

function performSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return;
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('searchBar').classList.remove('open');
  scrollToSection('products');
  const grid = document.getElementById('productsGrid');
  const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  grid.innerHTML = results.length ? results.map(productCard).join('') : `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray)"><i class="fas fa-search" style="font-size:48px;margin-bottom:16px;display:block"></i>לא נמצאו תוצאות עבור "${q}"</div>`;
}

// ===== DEAL TIMERS =====
function startDealTimers() {
  const ends = new Date();
  ends.setHours(23, 59, 59, 0);
  setInterval(() => {
    const now = new Date();
    const diff = ends - now;
    if (diff <= 0) return;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const txt = `${pad(h)}:${pad(m)}:${pad(s)}`;
    const t1 = document.getElementById('dealTimer1');
    const t2 = document.getElementById('dealTimer2');
    if (t1) t1.textContent = txt;
    if (t2) t2.textContent = txt;
  }, 1000);
}
function pad(n) { return String(n).padStart(2, '0'); }

// ===== NEWSLETTER =====
function subscribeNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  form.innerHTML = '<div style="color:white;font-size:18px;font-weight:700;text-align:center;padding:10px"><i class="fas fa-check-circle" style="margin-left:8px"></i>מעולה! קיבלת 10% הנחה על הקנייה הראשונה!</div>';
  showToast('&#127881; נרשמת בהצלחה! בדוק את המייל שלך.', 'success');
}

// ===== SWIPER =====
function initSwiper() {
  new Swiper('.testimonials-swiper', {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  const header = document.getElementById('mainHeader');
  const scrollBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) { header.classList.add('scrolled'); scrollBtn.classList.add('visible'); }
    else { header.classList.remove('scrolled'); scrollBtn.classList.remove('visible'); }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.category-card, .branch-card, .deal-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===== MODALS =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}


// ===== AUTH =====
const AUTH_USERS_KEY = 'rp_users';
const AUTH_SESSION_KEY = 'rp_session';

function getUsers() {
  return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}');
}
function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY) || 'null');
}
function saveSession(user) {
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

function openAuthModal() {
  const user = getCurrentUser();
  if (user) {
    toggleUserDropdown();
  } else {
    switchAuthTab('login');
    openModal('authModal');
  }
}

function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'flex' : 'none';
}

function submitEmailAuth(e, mode) {
  e.preventDefault();
  const users = getUsers();

  if (mode === 'register') {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const pass = document.getElementById('registerPassword').value;
    if (users[email]) {
      showToast('אימייל זה כבר רשום במערכת', 'error');
      return;
    }
    users[email] = { name, email, password: btoa(pass), provider: 'email', avatar: null };
    saveUsers(users);
    const user = { name, email, provider: 'email', avatar: null };
    saveSession(user);
    updateAuthUI(user);
    closeModal('authModal');
    showToast(`ברוך הבא, ${name}!`, 'success');

  } else {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPassword').value;
    const stored = users[email];
    if (!stored || stored.password !== btoa(pass)) {
      showToast('אימייל או סיסמה שגויים', 'error');
      document.getElementById('loginPassword').classList.add('error');
      setTimeout(() => document.getElementById('loginPassword').classList.remove('error'), 2000);
      return;
    }
    const user = { name: stored.name, email, provider: 'email', avatar: stored.avatar };
    saveSession(user);
    updateAuthUI(user);
    closeModal('authModal');
    showToast(`שלום, ${stored.name}!`, 'success');
  }
}

function signInWithGoogle() {
  // Google Identity Services — requires a real Client ID from console.cloud.google.com
  // Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Client ID
  const CLIENT_ID = '559625054879-hoq0holcnpjh76rpur3p21snsdthv7ii.apps.googleusercontent.com';
  if (CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    showToast('כדי להפעיל התחברות עם Google יש להגדיר Client ID', 'error');
    return;
  }
  if (typeof google === 'undefined') {
    showToast('טוען Google Sign-In...', '');
    return;
  }
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleGoogleCredential,
    ux_mode: 'popup'
  });
  google.accounts.id.prompt();
}

function handleGoogleCredential(response) {
  // Decode the JWT payload (no verification needed client-side for display)
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  const user = {
    name: payload.name,
    email: payload.email,
    avatar: payload.picture,
    provider: 'google'
  };
  const users = getUsers();
  if (!users[user.email]) {
    users[user.email] = { ...user, password: null };
    saveUsers(users);
  }
  saveSession(user);
  updateAuthUI(user);
  closeModal('authModal');
  showToast(`שלום, ${user.name}!`, 'success');
}

function logout() {
  clearSession();
  updateAuthUI(null);
  closeUserDropdown();
  showToast('התנתקת בהצלחה');
}

function updateAuthUI(user) {
  const btn = document.getElementById('authHeaderBtn');
  if (user) {
    const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    btn.innerHTML = `
      <div class="user-btn-wrap">
        <button class="user-avatar-btn" onclick="toggleUserDropdown()">
          ${user.avatar
            ? `<img src="${user.avatar}" class="user-avatar" alt="${user.name}" referrerpolicy="no-referrer" />`
            : `<div class="user-avatar-initials">${initials}</div>`}
          <span>${user.name.split(' ')[0]}</span>
        </button>
        <div class="user-dropdown" id="userDropdown">
          <div class="user-dropdown-header">
            <strong>${user.name}</strong>
            <span>${user.email}</span>
          </div>
          <button class="user-dropdown-item"><i class="fas fa-box"></i> ההזמנות שלי</button>
          <button class="user-dropdown-item"><i class="fas fa-heart"></i> המועדפים שלי</button>
          <button class="user-dropdown-item"><i class="fas fa-user-cog"></i> הגדרות חשבון</button>
          <button class="user-dropdown-item logout" onclick="logout()"><i class="fas fa-sign-out-alt"></i> התנתק</button>
        </div>
      </div>`;
  } else {
    btn.innerHTML = `<button class="action-btn" onclick="openAuthModal()" title="התחבר"><i class="fas fa-user"></i></button>`;
  }
}

function toggleUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.toggle('open');
}
function closeUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.innerHTML = `<i class="fas fa-eye${isText ? '' : '-slash'}"></i>`;
}

function forgotPassword() {
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) {
    showToast('הכנס אימייל כדי לאפס סיסמה', 'error');
    return;
  }
  showToast(`קישור לאיפוס סיסמה נשלח ל-${email}`, 'success');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  document.getElementById('mainNav').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const nav = document.getElementById('mainNav');
  if (nav && nav.classList.contains('open') && !e.target.closest('#mainNav') && !e.target.closest('.mobile-menu-btn')) {
    nav.classList.remove('open');
  }
  if (!e.target.closest('.user-btn-wrap')) {
    closeUserDropdown();
  }
});

// ===== NAVIGATION =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.remove('open');
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ===== TOAST =====
let toastTimer;
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.innerHTML = msg;
  toast.className = `toast ${type}`;
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== TREASURE CHEST ANIMATION =====
function animateTreasureChest() {
  const chest = document.querySelector('.treasure-chest');
  if (chest) {
    chest.addEventListener('click', () => {
      chest.style.animation = 'none';
      chest.style.transform = 'scale(1.1)';
      setTimeout(() => {
        chest.style.transform = '';
        chest.style.animation = 'chestBob 3s ease-in-out infinite';
      }, 200);
      showToast('&#127881; גלה את אוצר הצעצועים!', 'success');
    });
  }
}
