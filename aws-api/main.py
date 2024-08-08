from routers import auth, following
from database import engine
from fastapi import FastAPI
import models

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(following.router)
