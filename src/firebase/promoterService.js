import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

// Коллекция промоутеров
const promotersCollection = collection(db, 'promoters');
// Коллекция настроек
const settingsCollection = collection(db, 'settings');
const topPromoterDoc = doc(settingsCollection, 'topPromoter');
const settingsDoc = doc(settingsCollection, 'general');

// Функция для генерации URL аватара на основе имени
const generateAvatarUrl = (name) => {
  // Используем сервис UI Avatars для генерации аватара по имени
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
};

// Получить всех промоутеров, отсортированных по количеству листовок (по убыванию)
export const getPromoters = async () => {
  try {
    const q = query(promotersCollection, orderBy('leafletsCount', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Ошибка при получении промоутеров:', error);
    throw error;
  }
};

// Получить топ N промоутеров
export const getTopPromoters = async (topCount = 10) => {
  try {
    const q = query(
      promotersCollection, 
      orderBy('leafletsCount', 'desc'), 
      limit(topCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Ошибка при получении топ промоутеров:', error);
    throw error;
  }
};

// Получить промоутера по ID
export const getPromoterById = async (id) => {
  try {
    const docRef = doc(db, 'promoters', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении промоутера:', error);
    throw error;
  }
};

// Добавить нового промоутера
export const addPromoter = async (promoterData, avatarFile) => {
  try {
    // Вместо загрузки файла используем генерацию аватара по имени
    // или URL, если он предоставлен в promoterData.avatarUrl
    let avatarUrl = promoterData.avatarUrl || '';
    
    if (!avatarUrl && promoterData.name) {
      avatarUrl = generateAvatarUrl(promoterData.name);
    }
    
    // Создаем документ промоутера
    const newPromoter = {
      name: promoterData.name,
      avatarUrl,
      leafletsCount: Number(promoterData.leafletsCount) || 0,
      workDays: Number(promoterData.workDays) || 0,
      district: promoterData.district || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Рассчитываем скорость только если есть дни работы
    if (newPromoter.workDays > 0) {
      newPromoter.speed = Math.round(newPromoter.leafletsCount / newPromoter.workDays);
    } else {
      newPromoter.speed = 0;
    }
    
    const docRef = await addDoc(promotersCollection, newPromoter);
    return {
      id: docRef.id,
      ...newPromoter
    };
  } catch (error) {
    console.error('Ошибка при добавлении промоутера:', error);
    throw error;
  }
};

// Обновить данные промоутера
export const updatePromoter = async (id, data) => {
  try {
    const promoterRef = doc(db, 'promoters', id);
    await updateDoc(promoterRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Ошибка при обновлении промоутера:', error);
    throw error;
  }
};

// Удалить промоутера
export const deletePromoter = async (id) => {
  try {
    const promoterRef = doc(db, 'promoters', id);
    const promoterSnap = await getDoc(promoterRef);
    
    if (!promoterSnap.exists()) {
      throw new Error('Промоутер не найден');
    }
    
    // Удаляем документ
    await deleteDoc(promoterRef);
    
    return id;
  } catch (error) {
    console.error('Ошибка при удалении промоутера:', error);
    throw error;
  }
};

// Получить данные о лучшем промоутере месяца
export const getTopPromoter = async () => {
  try {
    const docSnap = await getDoc(topPromoterDoc);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении лучшего промоутера:', error);
    throw error;
  }
};

// Установить лучшего промоутера месяца
export const setTopPromoter = async (topPromoterData) => {
  try {
    // Если нет URL аватара, но есть имя, генерируем аватар
    if (!topPromoterData.avatarUrl && topPromoterData.name) {
      topPromoterData.avatarUrl = generateAvatarUrl(topPromoterData.name);
    }
    
    await setDoc(topPromoterDoc, {
      ...topPromoterData,
      date: serverTimestamp()
    });
    
    return topPromoterData;
  } catch (error) {
    console.error('Ошибка при установке лучшего промоутера:', error);
    throw error;
  }
};

// Получить настройки сайта
export const getSettings = async () => {
  try {
    const docSnap = await getDoc(settingsDoc);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Создаем документ с настройками по умолчанию, если его нет
      const defaultSettings = {
        companyLogo: 'https://via.placeholder.com/200x60?text=Logo',
        headerText: 'Конкурс для лучших! Стань топ-промоутером Петрозаводска!',
        telegramChannel: '',
        managerContacts: []
      };
      
      await setDoc(settingsDoc, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Ошибка при получении настроек:', error);
    throw error;
  }
};

// Обновить настройки сайта
export const updateSettings = async (settingsData, logoFile) => {
  try {
    // Используем URL логотипа из settingsData или оставляем текущий
    const updatedSettings = {
      ...settingsData
    };
    
    await setDoc(settingsDoc, updatedSettings);
    
    return updatedSettings;
  } catch (error) {
    console.error('Ошибка при обновлении настроек:', error);
    throw error;
  }
};

// Сбросить статистику всех промоутеров
export const resetAllPromotersStats = async () => {
  try {
    const promoters = await getPromoters();
    
    // Обновляем каждого промоутера
    const updatePromises = promoters.map(promoter => {
      const promoterRef = doc(db, 'promoters', promoter.id);
      return updateDoc(promoterRef, {
        leafletsCount: 0,
        workDays: 0,
        speed: 0,
        updatedAt: serverTimestamp()
      });
    });
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Ошибка при сбросе статистики:', error);
    throw error;
  }
}; 