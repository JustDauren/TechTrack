from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base

if TYPE_CHECKING:
    from .task import Task  # noqa
    from .part import Part  # noqa
    from .report import Report  # noqa


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    model = Column(String, index=True)
    serial_number = Column(String, unique=True, index=True)

    # Manufacturer info
    manufacturer = Column(String, index=True)
    year = Column(Integer)

    # Location
    city = Column(String, index=True)
    location = Column(String, index=True)
    organization = Column(String)
    address = Column(String)

    # Contact information
    contact_person = Column(String)
    contact_phone = Column(String)
    contact_email = Column(String)

    # Technical info
    status = Column(Enum("Рабочий", "Требует ТО", "В ремонте", name="equipment_status"), default="Рабочий")
    working_hours = Column(Float, default=0)
    max_energy = Column(String)
    warranty_expiry = Column(DateTime, nullable=True)

    # Notes and details
    notes = Column(Text)

    # Timestamps
    installed_at = Column(DateTime, nullable=True)
    last_service = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    tasks = relationship("Task", back_populates="equipment")
    parts = relationship("Part", back_populates="equipment")
    reports = relationship("Report", back_populates="equipment")

    def __repr__(self):
        return f"<Equipment {self.name} ({self.serial_number})>"