from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.errors import AppError
from app.routers import auth

app = FastAPI(title="OneTachka API", version="0.1.0")

# Тонкий фронт (Vite) ходить із іншого origin — на час MVP дозволяємо все.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Єдиний формат помилок: {"error": {"code", "message"}} ---

_STATUS_CODE_MAP = {
    400: "bad_request",
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    405: "method_not_allowed",
    409: "conflict",
}


def _error(status_code: int, code: str, message: str, **extra) -> JSONResponse:
    body = {"code": code, "message": message}
    body.update(extra)
    return JSONResponse(status_code=status_code, content={"error": body})


@app.exception_handler(AppError)
async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    return _error(exc.status_code, exc.code, exc.message)


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    return _error(
        400,
        "validation_error",
        "Invalid request data",
        details=jsonable_encoder(exc.errors()),
    )


@app.exception_handler(StarletteHTTPException)
async def handle_http_exception(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    code = _STATUS_CODE_MAP.get(exc.status_code, "error")
    return _error(exc.status_code, code, str(exc.detail))


# --- Routes ---

app.include_router(auth.router)


@app.get("/health")
def health() -> dict:
    return {"ok": True}
