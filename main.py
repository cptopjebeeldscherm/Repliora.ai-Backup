
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Serve built React frontend from /frontend/dist
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
