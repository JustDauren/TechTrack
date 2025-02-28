from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user_in: UserCreate) -> User:
    # Check if user with this email already exists
    db_user = get_user_by_email(db, email=user_in.email)
    if db_user:
        raise ValueError(f"User with email {user_in.email} already exists")

    # Check if user with this username already exists
    db_user = get_user_by_username(db, username=user_in.username)
    if db_user:
        raise ValueError(f"User with username {user_in.username} already exists")

    # Create new user
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        position=user_in.position,
        phone=user_in.phone,
        city=user_in.city,
        specialization=user_in.specialization,
        is_active=user_in.is_active,
        is_superuser=user_in.is_superuser,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User, user_in: UserUpdate) -> User:
    # Update user fields
    update_data = user_in.model_dump(exclude_unset=True)

    # Handle password separately
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    # Update user object
    for field, value in update_data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(db, username=username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def is_active_user(user: User) -> bool:
    return user.is_active


def is_superuser(user: User) -> bool:
    return user.is_superuser