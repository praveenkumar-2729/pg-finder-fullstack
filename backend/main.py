from fastapi import FastAPI
from database import Base, engine

from auth.routers import register, login
from owner.routers import post_pg, my_pgs, pg_room   # 🔥 ADD room HERE
from user.routers import pg as user_pg
from user.routers.booking import router as booking_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pg-finder-fullstack-2.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Include routers
app.include_router(register.router)
app.include_router(login.router)
app.include_router(post_pg.router)
app.include_router(my_pgs.router)

app.include_router(pg_room.router)  
app.include_router(user_pg.router)
app.include_router(booking_router)

@app.get("/")
def home():
    return {"message": "Backend Working"}
