# FastAPI
from fastapi.responses import RedirectResponse
from fastapi import APIRouter, Cookie, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field
from starlette import status

# Auth
from google.auth import jwt
import google_auth_oauthlib.flow

# Custom Libraries
from utils import db_dependency, is_session_valid, get_session
from models import TempState, GoogleUsers, Session

# Other Libraries
import re
from typing import Annotated
import urllib.parse
import requests
import datetime
import secrets
import os
import pytz
from dotenv import load_dotenv
load_dotenv()

router = APIRouter(
    prefix='/google-auth',
    tags=['google-auth']
)

CLIENT_ID = os.getenv("GOOGLE_AUTH_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_AUTH_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
SCOPE = "openid email profile"

CLIENT_SECRETS_FILE = "google-client-secret.json"
flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=['https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'openid'])
flow.redirect_uri = REDIRECT_URI


class SessionCheck(BaseModel):
    session_id: str


def create_unique_username(db: db_dependency, base_username: str) -> str:
    counter = 0
    while True:
        username = f"{base_username}{counter if counter else ''}"
        existing_user = db.query(GoogleUsers).filter(
            GoogleUsers.user_name == username).first()
        if not existing_user:
            return username
        counter += 1


def create_session(google_id, access_token, refresh_token, expires_in, db: db_dependency):
    # Generate a secure random session ID
    session_id = secrets.token_urlsafe(32)

    session = Session(
        session_id=session_id,
        google_id=google_id,
        access_token=access_token,
        refresh_token=refresh_token,
        token_expires_at=expires_in,
        session_expires_at=expires_in,
    )

    db.add(session)
    db.commit()

    return session_id


@router.post("/revoke-session", status_code=status.HTTP_200_OK)
def revokeSession(db: db_dependency, session_id: Annotated[str | None, Cookie()] = None):
    session = get_session(session_id, db)
    if is_session_valid(session, db):
        db.delete(session)
        db.commit()
        return {"msg": "session succesfully deleted"}

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="session was not deleted")


@router.get("/me")
def me(db: db_dependency, session_id: Annotated[str | None, Cookie()] = None):
    """
    Checks if session is valid. Invalid if session_id is not found in DB
    or session is expired
    """
    session = db.query(Session).filter(
        Session.session_id == session_id).first()

    if not is_session_valid(session, db):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    google_id = session.google_id
    user_info: GoogleUsers = db.query(GoogleUsers).filter(
        GoogleUsers.google_id == google_id).first()

    if not user_info:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return {
        "firstname": user_info.first_name,
        "lastname": user_info.last_name,
        "username": user_info.user_name,
        "email": user_info.email,
        "account_creation_date": user_info.created_at
    }


@router.post("/authenticated")
def isAuthenticated(db: db_dependency, session_check: SessionCheck):
    session_db = db.query(Session).filter(
        Session.session_id == session_check.session_id).first()
    # Check if session is valid
    if not is_session_valid(session_db, db):
        return {"authenticated": False}

    return {"authenticated": True}


@router.get("/authenticate")
def authenticate(db: db_dependency, session_id: Annotated[str | None, Cookie()] = None):
    # Check if session exists
    session = get_session(session_id, db)
    if not is_session_valid(session, db):

        authorization_url, state = flow.authorization_url(
            # Recommended, enable offline access so that you can refresh an access token without
            # re-prompting the user for permission. Recommended for web server apps.
            access_type='offline',
            # Optional, enable incremental authorization. Recommended as a best practice.
            include_granted_scopes='true',
            # Optional, if your application knows which user is trying to authenticate, it can use this
            # parameter to provide a hint to the Google Authentication Server.
            # Optional, set prompt to 'consent' will prompt the user for consent
            prompt='consent',

        )

        expires_at = datetime.datetime.now(
            tz=datetime.UTC) + datetime.timedelta(minutes=10)
        db.add(TempState(
            state_hash=state,
            expires_at=expires_at
        ))
        db.commit()

        return {"url": authorization_url}


@router.get("/callback")
def callback(db: db_dependency, request: Request):
    # Get state and code from query
    state = request.query_params.get("state")
    code = request.query_params.get("code")

    # Check if state exists in DB
    db_state = db.query(TempState).filter(
        TempState.state_hash == state).first()
    if not db_state or db_state.expires_at < datetime.datetime.now(tz=datetime.UTC):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired state")
    db.delete(db_state)
    db.commit()

    # Get Google Tokens and Scoped User Information
    url = "https://oauth2.googleapis.com/token"
    payload = {
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code',
        'access_type': 'offline',
        'prompt': 'consent'
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    try:
        token_response = requests.request(
            "POST", url, headers=headers, data=payload)
        token_response = token_response.json()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error occured while retrieving user information from Google servers.")
    jwt_payload = jwt.decode(token_response["id_token"], verify=False)

    # Create User if not exist
    user = db.query(GoogleUsers).filter(
        GoogleUsers.google_id == jwt_payload["sub"]).first()

    if (not user):
        base_username = re.sub(
            r'[^a-z0-9]', '', (jwt_payload["given_name"] + jwt_payload["family_name"]).lower())[:55]
        username = create_unique_username(db, base_username)

        new_user = GoogleUsers(
            google_id=jwt_payload["sub"],
            user_name=username,
            email=jwt_payload.get("email"),
            first_name=jwt_payload.get("given_name"),
            last_name=jwt_payload.get("family_name"),
            created_at=datetime.datetime.now(tz=datetime.UTC)
        )

        db.add(new_user)
        db.commit()

    # Data to pass
    access_token = token_response["access_token"],
    expire_date = datetime.datetime.fromtimestamp(
        jwt_payload["exp"], tz=pytz.UTC)
    expires_str = expire_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

    # Create Session
    session_id = create_session(
        jwt_payload["sub"], access_token, token_response["refresh_token"], expire_date, db)

    # Pass data via query parameters
    redirect_data = {
        "session_id": session_id,
        "expires_at": expires_str
    }
    encoded_data = urllib.parse.urlencode(redirect_data)

    response = RedirectResponse(
        url=f"http://localhost:3000/api/set-session-cookie?{encoded_data}")

    return response


# Changing username components
class ChangeUserNameRequest(BaseModel):
    new_username: str = Field(max_length=60, min_length=3, pattern=r'^[a-zA-Z0-9]+$')

@router.post("/change-username", status_code=status.HTTP_200_OK)
def changeUsername(db: db_dependency, request: ChangeUserNameRequest, session_id: Annotated[str | None, Cookie()] = None):
    session = get_session(session_id, db)
    if is_session_valid(session, db):
        account = db.query(GoogleUsers).filter(
            GoogleUsers.google_id == session.google_id).first()
        
        is_unique = db.query(GoogleUsers).filter(GoogleUsers.user_name == request.new_username).all()
        if len(is_unique) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
        
        if account:
            account.user_name = request.new_username
            db.commit()
            return {"message": "Username updated succesfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, status="Invalid session")
