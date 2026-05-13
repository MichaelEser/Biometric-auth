from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from app.db.base import Base
from datetime import datetime
import uuid

class BiometricTemplate(Base):
    __tablename__ = "biometric_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    embedding = Column(Vector(512), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    """"
    Vector(512) is the pgvector column that stores the ArcFace face embedding
    — 512 numbers representing a person's face

    ForeignKey("users.id") links each biometric template to exactly one user,
    and unique=True means one face per user
    """
