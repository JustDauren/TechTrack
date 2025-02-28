from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    """
    Access token schema
    """
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """
    Token payload schema
    """
    sub: Optional[int] = None