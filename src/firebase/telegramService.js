import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from './config';

// Коллекция настроек
const settingsCollection = collection(db, 'settings');
// Документ с настройками Telegram
const telegramConfigDoc = doc(settingsCollection, 'telegramConfig');

// Получить конфигурацию Telegram
export const getTelegramConfig = async () => {
  try {
    const docSnap = await getDoc(telegramConfigDoc);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Создаем документ с настройками по умолчанию, если его нет
      const defaultConfig = {
        botToken: '7836895913:AAGbj_E6i3AqXi7Sh2bDxn8WI0LRE7hNGBo',
        channelId: '',
        enabled: false
      };
      
      await setDoc(telegramConfigDoc, defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.error('Ошибка при получении конфигурации Telegram:', error);
    throw error;
  }
};

// Обновить конфигурацию Telegram
export const updateTelegramConfig = async (configData) => {
  try {
    await setDoc(telegramConfigDoc, configData);
    return configData;
  } catch (error) {
    console.error('Ошибка при обновлении конфигурации Telegram:', error);
    throw error;
  }
};

// Отправить сообщение в Telegram канал
export const sendTelegramMessage = async (message) => {
  try {
    const config = await getTelegramConfig();
    
    if (!config.enabled || !config.botToken || !config.channelId) {
      console.warn('Telegram интеграция отключена или не настроена');
      return false;
    }
    
    // Используем Telegram Bot API для отправки сообщения
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.channelId,
        text: message,
        parse_mode: 'HTML'
      }),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Ошибка Telegram API: ${data.description}`);
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
    throw error;
  }
};

// Отправить сообщение о новом лучшем промоутере
export const sendTopPromoterMessage = async (promoter) => {
  if (!promoter) return false;
  
  const message = `
🏆 <b>Лучший промоутер месяца!</b> 🏆

Поздравляем <b>${promoter.name}</b> с победой!
Количество разнесенных листовок: <b>${promoter.leafletsCount}</b>
Награда: <b>${promoter.reward}</b>

🎉 Так держать! 🎉
  `;
  
  return sendTelegramMessage(message);
};

/*
ИНСТРУКЦИЯ ПО НАСТРОЙКЕ TELEGRAM БОТА:

1. Бот уже создан, токен: 7836895913:AAGbj_E6i3AqXi7Sh2bDxn8WI0LRE7hNGBo
2. Создайте канал в Telegram и добавьте бота как администратора
3. Получите ID канала (channelId) - обычно это @имя_канала или числовой ID
4. Включите интеграцию в админ-панели (enabled: true)
5. Проверьте работу, отправив тестовое сообщение
*/ 