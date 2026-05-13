# Declarative Base — all models must import this
# Alembic reads metadata from here to detect migrations
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
