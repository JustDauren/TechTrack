import logging

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import Base, engine
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.user import create_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create first superuser if it doesn't exist
    user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
    if not user:
        user_in = UserCreate(
            username=settings.FIRST_SUPERUSER,
            email=settings.FIRST_SUPERUSER_EMAIL,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        create_user(db, user_in)
        logger.info("Created first superuser")
    else:
        logger.info("First superuser already exists")


def main() -> None:
    logger.info("Creating initial data")
    from app.db.session import SessionLocal
    db = SessionLocal()
    init_db(db)
    logger.info("Initial data created")


if __name__ == "__main__":
    main()