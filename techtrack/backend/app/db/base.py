# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.session import Base  # noqa
from app.models.user import User  # noqa
from app.models.task import Task  # noqa
from app.models.equipment import Equipment  # noqa
from app.models.part import Part  # noqa
from app.models.report import Report  # noqa
from app.models.trip import Trip  # noqa
from app.models.knowledge import KnowledgeItem  # noqa