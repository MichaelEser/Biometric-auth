# Alembic environment config
# Reads DATABASE_URL from .env
# Imports Base from app.db.base to detect all ORM models
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# sys.path.append makes it so the file can find the app/ package
sys.path.append(os.path.join(os.path.dirname(__file__), '..')) 

# imports the SQLAlchemy Base Class - which holds tehe metadata about all tables
from app.db.base import Base

# imports my two ORM models. ALembic needs to see these so ot knows what tables to create
from app.domain.users.models import User 
from app.domain.biometric.models import BiometricTemplate

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def get_url():
    return os.environ.get("DATABASE_URL", "").replace(
        "postgresql+asyncpg", "postgresql"
    )

def run_migrations_offline():
    url = get_url()
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(configuration, prefix="sqlalchemy.", poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
