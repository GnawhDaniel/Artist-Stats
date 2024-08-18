from datetime import datetime, timezone, UTC
from sqlalchemy.orm import Session
from database import SessionLocal
from typing import Annotated
from fastapi import Depends
from models import User
import models
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


def is_session_valid(session: models.Session, db: db_dependency):

    # Check if session is valid
    if not session or session.session_expires_at < datetime.now(tz=UTC):
        print('expired')
        if session:  # if exists but expired -> delete
            db.delete(session)
            db.commit()
        return False

    return True


def get_session(session_id: str, db: db_dependency):
    session = db.query(models.Session).filter(
        models.Session.session_id == session_id).first()
    
    return session


bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
