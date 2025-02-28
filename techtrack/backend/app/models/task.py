from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base

if TYPE_CHECKING:
    from .user import User  # noqa
    from .equipment import Equipment  # noqa
    from .report import Report  # noqa


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)

    # Location
    city = Column(String, index=True)
    location = Column(String, index=True)

    # Task metadata
    priority = Column(Enum("низкий", "средний", "высокий", name="priority_types"), index=True)
    status = Column(
        Enum("новая", "назначена", "в работе", "выполнена", "отменена", name="task_status"),
        default="новая",
        index=True
    )

    # Date handling
    date_type = Column(Enum("fixed", "nextService", name="date_types"), default="fixed")
    due_date = Column(DateTime, nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Foreign keys
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=True)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=True)

    # Relationships
    equipment = relationship("Equipment", back_populates="tasks")
    assigned_to = relationship("User", back_populates="tasks", foreign_keys=[assigned_to_id])
    created_by = relationship("User", back_populates="created_tasks", foreign_keys=[created_by_id])
    trip = relationship("Trip", back_populates="tasks")
    reports = relationship("Report", back_populates="task")

    def __repr__(self):
        return f"<Task {self.id}: {self.title}>"