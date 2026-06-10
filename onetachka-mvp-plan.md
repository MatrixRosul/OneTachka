# Onetachka — MVP: технічний план і промпт для розробки

Цей документ — готовий промпт. Скопіюй його цілком і віддай Claude Code (або іншому Claude) для покрокової розробки. Він містить: ідею, межі MVP, стек, архітектуру, модель даних, API, стан-машину замовлення та покроковий план з критеріями готовності.

---

## Частина 1. Ідея (коротко і чітко)

**Onetachka — «Uber для вантажів».** Платформа напряму з'єднує клієнтів із водіями вантажного транспорту, без посередників.

- **Клієнт** створює заявку: що везти (тип вантажу, вага), звідки і куди (адреса + координати).
- **Заявка** потрапляє у спільний пул відкритих замовлень.
- **Водії** бачать доступні замовлення, оцінюють деталі та приймають у один клік. Перший, хто прийняв — забирає замовлення.
- Після виконання обидві сторони ставлять оцінку.

Дві ролі користувача: **CLIENT** і **DRIVER**. Перший ринок — Закарпаття, далі масштабування на інші міста.

**Що дає цінність уже в MVP:** прозорий прямий зв'язок клієнт↔водій і повний цикл «створив заявку → водій прийняв → доставив → оцінили». Усе інше (GPS, чат, AI) — надбудова поверх цього циклу.

---

## Частина 2. Межі MVP

### Входить у MVP
- Реєстрація / вхід (телефон + пароль, JWT).
- Профіль водія (тип авто, вантажопідйомність, доступність).
- Створення заявки клієнтом.
- Список доступних заявок для водія + фільтр за типом авто/вагою.
- Прийняття заявки (перший прийняв — забрав).
- Життєвий цикл статусів замовлення до завершення.
- Оцінки та відгуки після завершення.
- Тонкий фронт для перевірки всіх потоків end-to-end.

### НЕ входить у MVP (фази 2+)
- GPS-трекінг у реальному часі.
- Вбудований чат.
- Push-сповіщення.
- WebSocket / realtime (на старті — polling кожні кілька секунд).
- AI-рекомендації, прогноз вартості, оптимізація маршрутів.
- Оплати / еквайринг.
- SMS-OTP, верифікація документів водія, KYC.
- Геопошук через PostGIS (на старті зберігаємо lat/lng як звичайні колонки).

> Правило: якщо фіча не входить у цикл «створив → прийняв → доставив → оцінив» — вона не в MVP.

---

## Частина 3. Технологічний стек

**Зафіксований стек (React + Python):**
- Backend: **Python + FastAPI** (сервер — **uvicorn**)
- ORM/моделі: **SQLModel** (Pydantic + SQLAlchemy в одному)
- Міграції: **Alembic**
- БД: **PostgreSQL**
- Авторизація: **JWT** через **python-jose**; хешування пароля через **passlib[bcrypt]**
- Валідація вхідних даних: вбудована в FastAPI через **Pydantic**
- Залежності: **Poetry** або `pip` + `requirements.txt` (на вибір)
- Frontend (мінімальний): **React + Vite + TypeScript**, звичайний `fetch`, мінімальна стилізація — фронт тут тимчасовий, лише щоб ганяти потоки.

Чому цей стек під продукт:
- AI-фічі з бачення (підбір замовлень, прогноз ціни, оптимізація маршрутів) живуть у тому ж Python-стеку, без окремого сервісу.
- FastAPI автоматично віддає інтерактивну OpenAPI/Swagger-документацію на `/docs` — безкоштовний інструмент для тестування API і зручний контракт для React.
- WebSocket для realtime (GPS, чат) у фазі 2 підтримується FastAPI нативно.

Структура репозиторію (моноріпо):
```
/backend
/web        # тимчасовий тестовий фронт
```

---

## Частина 4. Архітектура (мінімальна)

Класична трирівнева:
```
[ Web/Mobile клієнт ] --HTTP/JSON--> [ FastAPI ] --SQLModel--> [ PostgreSQL ]
```

- Без мікросервісів. Один монолітний API-сервіс.
- Без черг, без кешу, без сокетів на старті.
- Realtime імітуємо через polling з фронта (`GET /orders/available` раз на N секунд).
- AI-фічі в майбутньому додаються прямо в цей самий Python-стек (окремі модулі/роутери), без окремого сервісу — але не зараз.

Шари в backend:
```
routers (HTTP) -> services (бізнес-логіка) -> models/SQLModel (дані)
```
Валідація через Pydantic-схеми (request/response моделі) на рівні роутера. Бізнес-правила (хто що може робити, переходи статусів) — у services.

---

## Частина 5. Модель даних (SQLModel)

```python
import uuid
from enum import Enum
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


def new_id() -> str:
    return uuid.uuid4().hex


class Role(str, Enum):
    CLIENT = "CLIENT"
    DRIVER = "DRIVER"


class VehicleType(str, Enum):
    CAR = "CAR"
    VAN = "VAN"
    TRUCK_SMALL = "TRUCK_SMALL"
    TRUCK_LARGE = "TRUCK_LARGE"


class OrderStatus(str, Enum):
    SEARCHING = "SEARCHING"      # створено, шукає водія
    ACCEPTED = "ACCEPTED"        # водій прийняв
    IN_PROGRESS = "IN_PROGRESS"  # вантаж забрано, в дорозі
    COMPLETED = "COMPLETED"      # доставлено
    CANCELLED = "CANCELLED"      # скасовано


class User(SQLModel, table=True):
    id: str = Field(default_factory=new_id, primary_key=True)
    role: Role
    full_name: str
    phone: str = Field(unique=True, index=True)
    password_hash: str
    rating_avg: float = 0
    rating_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    driver_profile: Optional["DriverProfile"] = Relationship(back_populates="user")


class DriverProfile(SQLModel, table=True):
    id: str = Field(default_factory=new_id, primary_key=True)
    user_id: str = Field(foreign_key="user.id", unique=True)
    vehicle_type: VehicleType
    capacity_kg: int
    license_plate: str
    is_available: bool = False
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None

    user: User = Relationship(back_populates="driver_profile")


class Order(SQLModel, table=True):
    id: str = Field(default_factory=new_id, primary_key=True)
    status: OrderStatus = OrderStatus.SEARCHING

    client_id: str = Field(foreign_key="user.id", index=True)
    driver_id: Optional[str] = Field(default=None, foreign_key="user.id", index=True)

    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float

    cargo_type: str
    weight_kg: int
    vehicle_type: VehicleType          # який тип авто потрібен
    description: Optional[str] = None
    price: Optional[Decimal] = None     # ціну вводить клієнт вручну (MVP)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    reviews: List["Review"] = Relationship(back_populates="order")


class Review(SQLModel, table=True):
    id: str = Field(default_factory=new_id, primary_key=True)
    order_id: str = Field(foreign_key="order.id", index=True)
    from_user_id: str = Field(foreign_key="user.id")
    to_user_id: str = Field(foreign_key="user.id")
    score: int                          # 1..5
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    order: Order = Relationship(back_populates="reviews")
```

> Зв'язки `Order.client/driver` та `Review.from/to` ведуть на одну й ту саму таблицю `user` двічі. У SQLModel це задається явними `foreign_key` (як вище); для relationship-об'єктів у разі неоднозначності додавай `sa_relationship_kwargs={"foreign_keys": "..."}`. Для MVP достатньо тримати самі `*_id` і підвантажувати користувачів запитом — без складних relationship.

---

## Частина 6. Стан-машина замовлення

```
SEARCHING --(водій приймає)--------> ACCEPTED
ACCEPTED  --(водій: "забрав вантаж")-> IN_PROGRESS
IN_PROGRESS --(водій: "доставлено")-> COMPLETED
SEARCHING --(клієнт скасовує)-------> CANCELLED
ACCEPTED  --(клієнт або водій)------> CANCELLED
```

Правила:
- Прийняти замовлення може лише водій, і лише коли статус `SEARCHING`. Прийняття атомарне: якщо двоє натиснули одночасно — другому повертається помилка (перевіряй статус у транзакції).
- Перевід `ACCEPTED -> IN_PROGRESS -> COMPLETED` робить лише призначений водій.
- Скасувати `COMPLETED` неможливо.
- Відгук можна залишити лише після `COMPLETED`, один відгук на пару (автор→ціль) на замовлення.
- Після кожного нового відгуку перерахувати `ratingAvg` і `ratingCount` цільового користувача.

---

## Частина 7. API (REST)

Усі захищені ендпоінти вимагають заголовок `Authorization: Bearer <token>`.

**Auth**
- `POST /auth/register` — `{ role, fullName, phone, password }` → `{ token, user }`
- `POST /auth/login` — `{ phone, password }` → `{ token, user }`
- `GET /me` — поточний користувач (+ профіль водія, якщо є)

**Профіль водія** (роль DRIVER)
- `PUT /driver/profile` — створити/оновити `{ vehicleType, capacityKg, licensePlate }`
- `PATCH /driver/availability` — `{ isAvailable }` (+ опційно `currentLat`, `currentLng`)

**Замовлення (клієнт)**
- `POST /orders` — створити заявку (усі поля вантажу/маршруту)
- `GET /orders` — мої замовлення (для клієнта — свої створені; для водія — свої прийняті)
- `GET /orders/:id` — деталі замовлення (доступ лише учаснику)
- `POST /orders/:id/cancel` — скасувати

**Замовлення (водій)**
- `GET /orders/available` — список `SEARCHING`, відфільтрований під авто водія (`vehicleType`, `capacityKg >= weightKg`); сортування — за датою (відстань — у фазі 2)
- `POST /orders/:id/accept` — прийняти (атомарно)
- `POST /orders/:id/status` — `{ status: "IN_PROGRESS" | "COMPLETED" }`

**Відгуки**
- `POST /orders/:id/review` — `{ score, comment }` (після COMPLETED)

Загальні вимоги:
- Усі вхідні тіла валідувати через Zod.
- Помилки у форматі `{ error: { code, message } }`, коректні HTTP-статуси (400/401/403/404/409).
- `409 Conflict` — коли водій намагається прийняти вже прийняте замовлення.

---

## Частина 8. Покроковий план (фази)

Виконуй строго по порядку. Не переходь до наступної фази, поки не виконано «Готово» поточної.

### Фаза 0 — Setup
- Ініціалізувати моноріпо: `/backend`, `/web`.
- Backend: Python 3.11+, FastAPI, uvicorn, SQLModel, Alembic, python-jose, passlib[bcrypt], python-dotenv. Залежності — через Poetry або `requirements.txt`.
- Підняти PostgreSQL (локально або Docker). Файл `.env` з `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- Завести SQLModel-моделі (Частина 5), налаштувати Alembic і зробити першу міграцію.
- Структура: `app/main.py`, `app/db.py` (engine + session), `app/models.py`, `app/routers/`, `app/services/`, `app/schemas/` (Pydantic request/response), `app/deps.py` (залежності: сесія БД, поточний користувач).
- `GET /health` → `{ "ok": true }`. Перевірити, що `/docs` (Swagger) відкривається.
- **Готово:** сервер стартує (`uvicorn app.main:app --reload`), `/health` і `/docs` відповідають, БД мігрована.

### Фаза 1 — Auth
- `register`, `login`, `GET /me`. Хешування пароля через passlib (bcrypt). JWT (python-jose) з `sub=user_id` і `role`.
- FastAPI-залежності: `get_current_user` (перевіряє Bearer-токен) і `require_role(...)` для розмежування CLIENT/DRIVER.
- **Готово:** можна зареєструвати клієнта і водія, увійти, отримати `/me`.

### Фаза 2 — Профіль водія
- `PUT /driver/profile`, `PATCH /driver/availability`.
- **Готово:** водій заповнює профіль і вмикає доступність.

### Фаза 3 — Замовлення: створення і перегляд
- `POST /orders`, `GET /orders`, `GET /orders/:id` з перевіркою доступу.
- **Готово:** клієнт створює заявку і бачить свій список.

### Фаза 4 — Матчинг і прийняття
- `GET /orders/available` з фільтром під авто.
- `POST /orders/:id/accept` — атомарно (транзакція + перевірка статусу).
- **Готово:** водій бачить відповідні заявки і приймає; повторне прийняття дає 409.

### Фаза 5 — Життєвий цикл і завершення
- `POST /orders/:id/status` (`IN_PROGRESS`, `COMPLETED`), `POST /orders/:id/cancel`.
- Дотримання стан-машини (Частина 6).
- **Готово:** повний шлях заявки до `COMPLETED` і скасування працюють із правильними правами.

### Фаза 6 — Відгуки
- `POST /orders/:id/review` + перерахунок рейтингу.
- **Готово:** після завершення обидві сторони ставлять оцінку, рейтинг оновлюється.

### Фаза 7 — Мінімальний фронт (E2E-перевірка)
- React + Vite. Сторінки: вхід/реєстрація; для клієнта — створити заявку + список; для водія — доступні заявки + прийняти + змінити статус; екран відгуку.
- `GET /orders/available` опитувати polling-ом раз на 5 секунд.
- Мінімум стилів — це тимчасовий фронт.
- **Готово:** весь цикл проходиться через UI двома акаунтами (клієнт + водій).

### Фази 2+ (після MVP, окремими ітераціями)
WebSocket замість polling → push-сповіщення → вбудований чат → GPS-трекінг (PostGIS, геопошук за відстанню) → SMS-OTP і верифікація водіїв → оплати → AI-рекомендації й прогноз ціни (як модулі в тому ж Python-беку).

---

## Частина 9. Конвенції та нефункціональні вимоги

- Уся бізнес-логіка — у `services`; роутери лише приймають запит, валідують через Pydantic-схему і віддають відповідь.
- Жодних секретів у коді — лише через `.env`.
- Усі грошові поля — `Decimal`, не `float`.
- Усі переходи статусів — через сервіс із перевіркою поточного статусу; прийняття замовлення робити в транзакції (`session.begin()` / `SELECT ... FOR UPDATE` або повторна перевірка статусу), щоб уникнути гонки двох водіїв.
- Окремі Pydantic-схеми для request і response (не віддавати `password_hash` назовні).
- Сідер для тестових даних: 1 клієнт, 2 водії різних авто, кілька заявок.
- README з командами запуску бека (`uvicorn`), фронта (`vite`) і міграцій (`alembic upgrade head`).

---

## Частина 10. Definition of Done для MVP

MVP вважається готовим, коли двома акаунтами (клієнт і водій) через тонкий фронт можна:
1. Зареєструватися й увійти.
2. Водієві — заповнити профіль і стати доступним.
3. Клієнту — створити заявку.
4. Водієві — побачити заявку у списку доступних і прийняти її.
5. Водієві — провести заявку через `IN_PROGRESS` до `COMPLETED`.
6. Обом — залишити відгук, рейтинг оновлюється.
7. Скасування заявки працює з коректними правами доступу.

Лише після цього починаємо накладати готові дизайни з Claude Design.
