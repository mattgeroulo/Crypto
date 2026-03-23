from sqlalchemy import create_engine,text
from sqlalchemy.orm import sessionmaker, declarative_base
from pathlib import Path
from dotenv import load_dotenv
import os
env_path= Path(__file__).resolve().parents[2]/".env"
load_dotenv(env_path)

DATABASE_URL =  os.getenv(
    "DATABASE_URL"
)
print(f'env_path: {env_path} \n databaseUrl: {DATABASE_URL}')
print(DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base = declarative_base()

def connection_test():
    with engine.connect() as connection:
        result = connection.execute(text("Select 1"))
        print(result.scalar())