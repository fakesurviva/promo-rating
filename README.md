# Рейтинг промоутеров Петрозаводска

Профессиональный сайт для рейтинга промоутеров с современным дизайном, анимациями и интеграцией с Telegram.

## Особенности

- 🏆 Рейтинг промоутеров с красивыми анимированными карточками
- 🎉 Баннер "Самый быстрый промоутер месяца" с эффектом конфетти
- 📱 Полностью адаптивный дизайн для всех устройств
- 🔒 Защищенная админ-панель для управления данными
- 📊 Управление промоутерами (добавление, редактирование, удаление)
- 🏅 Выбор лучшего промоутера месяца
- 📲 Интеграция с Telegram для автоматических постов
- ⚙️ Настройка логотипа, текста и контактной информации

## Технологии

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Интеграции**: Telegram Bot API
- **Анимации**: React Confetti, Framer Motion

## Установка и запуск

### Предварительные требования

- Node.js (версия 14 или выше)
- npm или yarn
- Аккаунт Firebase

### Шаги по установке

1. Клонируйте репозиторий:
   ```
   git clone https://github.com/your-username/promo-rating.git
   cd promo-rating
   ```

2. Установите зависимости:
   ```
   npm install
   ```

3. Создайте проект в [Firebase Console](https://console.firebase.google.com/):
   - Создайте новый проект
   - Включите Authentication (Email/Password)
   - Создайте Firestore Database
   - Создайте Storage
   - Зарегистрируйте веб-приложение и получите конфигурацию

4. Настройте Firebase:
   - Откройте файл `src/firebase/config.js`
   - Замените значения в объекте `firebaseConfig` на ваши значения из Firebase Console

5. Запустите проект в режиме разработки:
   ```
   npm start
   ```

6. Создайте первого пользователя-администратора:
   - Используйте Firebase Authentication Console для создания пользователя с email и паролем
   - Этот пользователь будет иметь доступ к админ-панели

## Деплой

### Деплой на Firebase Hosting

1. Установите Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Войдите в аккаунт Firebase:
   ```
   firebase login
   ```

3. Инициализируйте Firebase в проекте:
   ```
   firebase init
   ```
   - Выберите Hosting
   - Выберите ваш проект Firebase
   - Укажите `build` как публичную директорию
   - Настройте приложение как SPA (Single Page Application)

4. Соберите проект:
   ```
   npm run build
   ```

5. Разверните на Firebase Hosting:
   ```
   firebase deploy
   ```

## Настройка Telegram интеграции

1. Создайте нового бота через [@BotFather](https://t.me/BotFather) в Telegram
2. Получите токен бота
3. Создайте канал в Telegram и добавьте бота как администратора
4. В админ-панели сайта перейдите в раздел "Telegram"
5. Введите токен бота и ID канала
6. Включите интеграцию и сохраните настройки

## Структура проекта

```
src/
├── assets/          # Статические ресурсы (изображения, иконки)
├── components/      # React компоненты
│   └── admin/       # Компоненты для админ-панели
├── context/         # React контексты (AuthContext)
├── firebase/        # Сервисы для работы с Firebase
├── pages/           # Страницы приложения
│   └── admin/       # Страницы админ-панели
└── styles/          # CSS стили
```

## Лицензия

MIT

## Автор

Ваше имя - [ваш email](mailto:your.email@example.com) 