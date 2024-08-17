from routers import auth, following, auth_google
from database import engine
from fastapi import FastAPI
import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

models.Base.metadata.create_all(bind=engine)

# app.include_router(auth.router)
app.include_router(following.router)
app.include_router(auth_google.router)
