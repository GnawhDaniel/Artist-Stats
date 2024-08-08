from datetime import datetime, timezone
from sqlalchemy.orm import Session
from database import SessionLocal
from typing import Annotated
from fastapi import Depends
from models import User
from passlib.context import CryptContext


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def hash_password(password: str):
    return bcrypt_context.hash(password)


def authenticate_user(username: str, password: str,
                      db: db_dependency):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def is_access_token_expired(expiry: datetime):
    return True if expiry < datetime.now(timezone.utc) else False


bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
