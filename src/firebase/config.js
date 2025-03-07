import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD85M5Di_L2Df2gHwPtnEDRL7Ttud6zrLE",
  authDomain: "promo-rating.firebaseapp.com",
  projectId: "promo-rating",
  storageBucket: "promo-rating.firebasestorage.app",
  messagingSenderId: "695043971931",
  appId: "1:695043971931:web:6078a50dc725a1d55c587e",
  measurementId: "G-Q8W8N75XNC"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт сервисов Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

/*
ИНСТРУКЦИЯ ПО НАСТРОЙКЕ FIREBASE:

1. Настройте Authentication:
   - В меню слева выберите "Authentication"
   - Нажмите "Начать"
   - Во вкладке "Sign-in method" включите "Email/Password"
   - Создайте первого пользователя во вкладке "Users" (это будет ваш админ)

2. Структура базы данных Firestore:

- promoters (коллекция)
  - {promoterId} (документ)
    - name: string
    - avatarUrl: string (URL изображения из интернета)
    - leafletsCount: number
    - createdAt: timestamp
    - updatedAt: timestamp

- settings (коллекция)
  - topPromoter (документ)
    - promoterId: string
    - name: string
    - avatarUrl: string (URL изображения из интернета)
    - reward: string
    - date: timestamp
  
  - general (документ)
    - companyLogo: string (URL логотипа из интернета)
    - headerText: string
    - telegramChannel: string
    - managerContacts: array
  
  - telegramConfig (документ)
    - botToken: string (токен бота Telegram)
    - channelId: string (ID канала Telegram)
    - enabled: boolean
*/ 