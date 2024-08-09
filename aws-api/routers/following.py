from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Cookie, HTTPException
from utils import db_dependency, is_access_token_expired
from starlette import status
from models import User, ArtistStats, Artists
from .auth import get_current_user

router = APIRouter(
    prefix='/artists',
    tags=['auth']
)


user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/getall", status_code=status.HTTP_200_OK)
async def fetch_artists_query(db: db_dependency, query: str | None = None, session_id: Annotated[str | None, Cookie()] = None):
    # No token provided
    if not session_id:  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    _user = await get_current_user(db, session_id)

    if not query:
        artists = db.query(Artists).all()
    else:
        artists = db.query(Artists).filter(
            Artists.artist_name.ilike(f'%{query}%')).all()
    return artists


@router.get("/{id}", status_code=status.HTTP_200_OK)
async def fetch_artist_stats(
    id: str,
    db: db_dependency,
    session_id: Annotated[str | None, Cookie()] = None
):
    # No token provided
    if not session_id:  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    _user = await get_current_user(db, session_id)

    # Check if session token is live
    # if is_access_token_expired(user.session_id_expiry):
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    artist = db.query(ArtistStats).filter(
        ArtistStats.artist_id == id).order_by(ArtistStats.date).all()

    if artist:
        artist = [{"date": i.date, "followers": i.followers} for i in artist]
        artist_min = min(artist, key=lambda x: x["followers"])
        artist_max = max(artist, key=lambda x: x["followers"])

        return {"data": artist, "min_followers": artist_min, "max_followers": artist_max}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Could not find artist with id {id}")
