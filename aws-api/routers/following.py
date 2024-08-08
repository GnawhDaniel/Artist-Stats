from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from utils import db_dependency, is_access_token_expired
from starlette import status
from datetime import datetime, timezone
from models import User

router = APIRouter(
    prefix='/artists',
    tags=['auth']
)


user_dependency = Annotated[dict, Depends()]


@router.get("/{id}", status_code=status.HTTP_200_OK)
def fetch_artist_stats(
    id: str,
    db: db_dependency,
    session_id: Annotated[str | None, Cookie()] = None
):
    print(session_id)
    # Check if session token is live
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    print(user.session_id_expiry)
    print(datetime.now(timezone.utc))
    if is_access_token_expired(user.session_id_expiry):
        # Expired token
        return {"bad_token"}
        # Refresh ?
        # Raise ?    
        pass
    
    return {"good_token"}
