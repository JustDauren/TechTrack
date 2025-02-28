from datetime import datetime
from typing import List, TYPE_CHECKING

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from app.db.session import Base

if TYPE_CHECKING:
    from .task import Task  # noqa
    from .equipment import Equipment  # noqa
    from .report import Report  # noqa
    from .trip import Trip  # noqa


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    position = Column(String, index=True)
    phone = Column(String)
    city = Column(String)
    specialization = Column(String)

    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    tasks = relationship("Task", back_populates="assigned_to", foreign_keys="Task.assigned_to_id")
    created_tasks = relationship("Task", back_populates="created_by", foreign_keys="Task.created_by_id")

    reports = relationship("Report", back_populates="created_by")
    trips = relationship("Trip", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"