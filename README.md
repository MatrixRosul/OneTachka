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

## Запуск frontend (з Фази 7)

```bash
cd web
npm install
npm run dev
```

## Міграції

```bash
cd backend
alembic revision --autogenerate -m "опис"
alembic upgrade head
```

Детальний план MVP та фази розробки — у `onetachka-mvp-plan.md`.
