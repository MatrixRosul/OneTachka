"""Єдиний контракт помилок: усе назовні у форматі {"error": {"code", "message"}}."""


class AppError(Exception):
    """Доменна помилка з HTTP-статусом, машинним кодом і повідомленням."""

    def __init__(self, status_code: int, code: str, message: str):
        self.status_code = status_code
        self.code = code
        self.message = message
        super().__init__(message)


def bad_request(message: str, code: str = "bad_request") -> AppError:
    return AppError(400, code, message)


def unauthorized(message: str = "Not authenticated", code: str = "unauthorized") -> AppError:
    return AppError(401, code, message)


def forbidden(message: str = "Forbidden", code: str = "forbidden") -> AppError:
    return AppError(403, code, message)


def not_found(message: str = "Not found", code: str = "not_found") -> AppError:
    return AppError(404, code, message)


def conflict(message: str, code: str = "conflict") -> AppError:
    return AppError(409, code, message)
