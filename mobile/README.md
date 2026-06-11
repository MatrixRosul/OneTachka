# OneTachka — мобільний застосунок (Expo)

Справжній мобільний клієнт (Expo + React Native + TypeScript), стилізований за
дизайном Claude Design (`/design-reference`). Реалізує **MVP-функціонал**,
підключений до реального бекенду: auth, профіль водія, створення/перегляд
замовлень, матчинг/прийняття, статуси, скасування, відгуки.

## Стек
- Expo SDK 56, React Native 0.85, React 19
- React Navigation (bottom tabs), react-native-svg (іконки/силуети)
- expo-secure-store (JWT; на web — localStorage), @expo-google-fonts/manrope
- Дизайн-токени з шаблону: синій `#1E3A8A` + жовтий `#F2C84B`, Manrope

## Запуск

Спершу підніми бекенд (за замовчуванням застосунок очікує його на `:8010`):

```bash
cd backend && .venv/bin/uvicorn app.main:app --port 8010 --reload
```

Далі застосунок:

```bash
cd mobile
npm install
npm run web        # у браузері (швидка перевірка)
# або
npx expo start     # QR для Expo Go (iOS/Android) чи симулятор
```

## API URL
- **Web / iOS-симулятор:** `http://localhost:8010` (дефолт) — працює як є.
- **Фізичний телефон (Expo Go):** localhost телефон не побачить. Запусти з
  LAN-IP машини:
  ```bash
  EXPO_PUBLIC_API_URL=http://192.168.X.X:8010 npx expo start
  ```
- **Android-емулятор:** `EXPO_PUBLIC_API_URL=http://10.0.2.2:8010`.

## Структура
```
src/
  theme.ts              дизайн-токени
  api.ts / storage.ts   типований клієнт + токен (SecureStore/localStorage)
  AuthContext.tsx       сесія, login/register/logout
  navigation/           роутер + таб-бари за роллю
  components/           Icon, Truck, ui (кнопки/поля/картки), OrderCard, ReviewForm, VehiclePicker
  screens/
    AuthScreen.tsx
    client/             Home, CreateOrder, Orders, (+ спільний ProfileScreen)
    driver/             Dashboard, Available, Orders, Profile
```

## Поза MVP (не реалізовано — нема бекенду)
GPS-трекінг, чат, оплати, premium, OTP/SMS, AI-прайсинг. Це екрани дизайну
фази 2+; додаються разом із відповідним бекендом.
