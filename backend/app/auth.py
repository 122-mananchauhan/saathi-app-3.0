import datetime
import hashlib
import json
import base64
from typing import Optional
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models

# Try importing passlib / jose; if missing, use pure Python fallback
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
except Exception:
    def get_password_hash(password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

SECRET_KEY = "kisan_market_secret_jwt_key_agritech_platform_2026"

try:
    from jose import JWTError, jwt
    def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
        to_encode = data.copy()
        expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(days=1))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
        
    def decode_token(token: str) -> Optional[str]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload.get("sub")
        except JWTError:
            return None
except Exception:
    def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
        raw = json.dumps({"sub": data.get("sub"), "role": data.get("role")})
        return base64.b64encode(raw.encode()).decode()

    def decode_token(token: str) -> Optional[str]:
        try:
            raw = base64.b64decode(token.encode()).decode()
            data = json.loads(raw)
            return data.get("sub")
        except Exception:
            return None

def get_current_user(token: str = None, db: Session = Depends(get_db)) -> Optional[models.User]:
    if not token:
        return None
    email = decode_token(token)
    if not email:
        return None
    return db.query(models.User).filter(models.User.email == email).first()
