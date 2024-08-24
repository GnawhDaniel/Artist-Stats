from datetime import datetime, timezone, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, Request
from utils import db_dependency, hash_password, authenticate_user, is_access_token_expired
from sqlalchemy.exc import IntegrityError
from typing import Annotated, Optional
from pydantic import BaseModel, Field
from secrets import token_hex
from starlette import status
from models import User

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


class CreateUserReq(BaseModel):
    username: str = Field(min_length=3, max_length=25)
    email: Optional[str] = None
    first_name: str
    last_name: str
    password: str


async def get_current_user(db: db_dependency, token: Annotated[str, Depends(oauth2_scheme)]): 
    user = db.query(User).filter(User.session_id==token).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find user based on session id")
    
    if is_access_token_expired(user.session_id_expiry):
        print("expired")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    return user


@router.get("/users/me", status_code=status.HTTP_200_OK)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
):  
    # Remove password and session information
    return {
        "firstname": current_user.firstname,
        "lastname": current_user.lastname,
        "username": current_user.username,
        "email": current_user.email,
        "user_role": current_user.user_role,
        "account_creation_date": current_user.created_date
    }


@router.post("/login")
def login(response: Response, db: db_dependency,
          form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
          ):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user or not user.session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")
        
    access_token = user.session_id
    # Check if token is expired or not
    if is_access_token_expired(user.session_id_expiry):
        access_token = token_hex(100)
        user.session_id = access_token
        user.session_id_expiry = (datetime.now(
            timezone.utc)+timedelta(minutes=30))
        try:
            db.add(user)
            db.commit()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    response.set_cookie(
        key="session_id",
        value=user.session_id,
        httponly=True,  # Prevent JS access to the cookie
        secure=False,  # TODO: MAKE SURE TO SET THIS TO TRUE ON PROD WHEN RUNNING HTTPS
        max_age=3600  # TODO: Sync w/ database expiry
    )

    return {"message": "successfully logged in"}


@router.post("/token", status_code=status.HTTP_201_CREATED)
async def get_token(response: Response, db: db_dependency,
                    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                    ):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user or not user.session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")

    response.set_cookie(
        key="session_id",
        value=user.session_id,
        httponly=True,  # Prevent JS access to the cookie
        secure=False,  # TODO: MAKE SURE TO SET THIS TO TRUE ON PROD WHEN RUNNING HTTPS
        samesite='lax',
        max_age=3600  # TODO: sync with databases expiration date
    )
    return {"access_token": user.session_id, "token_type": "bearer"}


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(db: db_dependency, user: CreateUserReq):
    user = User(
        email=user.email,
        username=user.username,
        firstname=user.first_name,
        lastname=user.last_name,
        hashed_password=hash_password(user.password),
        session_id="",
        session_id_expiry=datetime.now(timezone.utc)
    )
    try:
        db.add(user)
        db.commit()
    except IntegrityError:
        raise HTTPException(
            status_code=400, detail="email or username already exists")
