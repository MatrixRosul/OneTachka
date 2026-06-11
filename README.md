# OneTachka

«Uber для вантажів» — платформа, що напряму з'єднує клієнтів із водіями вантажного транспорту.

Дві ролі: **CLIENT** і **DRIVER**. Повний цикл MVP: клієнт створює заявку → вона потрапляє у спільний пул → водій бачить відфільтровані під своє авто заявки і приймає в один клік (атомарно, перший забрав) → проводить через `IN_PROGRESS` до `COMPLETED` → обидві сторони ставлять оцінку.

## Стек

- **Backend:** Python 3.12 + FastAPI (uvicorn), SQLModel, Alembic, PostgreSQL
- **Auth:** JWT (python-jose) + passlib[bcrypt]
- **Frontend (тимчасовий):** React + Vite + TypeScript

## Структура

```
/backend   # FastAPI API-сервіс
/web        # тимчасовий тестовий фронт (React + Vite)
```

## Запуск backend

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # заповнити DATABASE_URL, JWT_SECRET
alembic upgrade head          # застосувати міграції
uvicorn app.main:app --reload # сервер на http://localhost:8000
```

- Health-check: http://localhost:8000/health
- Swagger / OpenAPI: http://localhost:8000/docs

## Запуск frontend

Тонкий React+Vite+TS фронт для наскрізної перевірки потоків.

```bash
cd web
npm install
cp .env.example .env   # за потреби змінити VITE_API_URL (дефолт http://localhost:8000)
npm run dev            # http://localhost:5173
```

Бекенд має бути запущений (за замовчуванням на `:8000`). CORS уже відкритий.

## Мобільний застосунок (Expo)

Справжній мобільний клієнт за дизайном Claude Design — у `/mobile` (Expo + React Native + TS), реалізує MVP-функціонал, підключений до бекенду. Запуск і деталі — у `mobile/README.md`. Коротко:

```bash
cd backend && .venv/bin/uvicorn app.main:app --port 8010 --reload   # бек
cd mobile && npm install && npm run web                              # застосунок у браузері
```

Дизайн-референс (бандл Claude Design) збережено в `/design-reference`.

**Перевірка MVP двома акаунтами:** відкрий додаток у двох вікнах/профілях браузера — зареєструй клієнта і водія. Водій: заповни профіль авто + увімкни доступність. Клієнт: створи заявку. Водій: побач її в «Доступні», прийми, проведи «Забрав вантаж» → «Доставлено». Обидва: залиш відгук на завершеному замовленні — рейтинг оновиться.

## Міграції

```bash
cd backend
alembic revision --autogenerate -m "опис"
alembic upgrade head
```

Детальний план MVP та фази розробки — у `onetachka-mvp-plan.md`.
