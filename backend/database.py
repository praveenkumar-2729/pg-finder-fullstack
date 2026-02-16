import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE URL from Render Environment Variable
DATABASE_URL = os.getenv("DATABASE_URL")

# CREATE ENGINE → Connect to Render PostgreSQL
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# CREATE SESSION → for DB operations
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

# BASE CLASS → for all models
Base = declarative_base()

# DEPENDENCY → used in FastAPI routes to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
