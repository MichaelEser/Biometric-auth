import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class BiometricTemplate(Base):
    """A normalized 512-dimensional ArcFace embedding for one user."""

    __tablename__ = "biometric_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    embedding = Column(Vector(512), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
