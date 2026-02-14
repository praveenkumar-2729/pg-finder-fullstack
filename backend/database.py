from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE URL (address of database)
DATABASE_URL = "postgresql://postgres:praveen%4027@localhost:5432/pgfinder"

# CREATE ENGINE → Connect to PostgreSQL
engine = create_engine(DATABASE_URL)

#  CREATE SESSION → for DB operations
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

#  BASE CLASS → for all models
Base = declarative_base()

#  DEPENDENCY → used in FastAPI routes to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
