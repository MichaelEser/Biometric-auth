from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.auth.repository import (
    get_user_for_login,
    register_new_user,
    user_exists
)
from app.core.security import get_password_hash, check_password, issue_tokens
from app.domain.users.models import User


async def register_user(
    db: AsyncSession,
    email: str,
    username: str,
    password: str
) -> User:
    """
    Register a new user in the system.
    
    Args:
        db: Async database session
        email: User's email address
        username: Unique username
        password: Plain text password (will be hashed)
        
    Returns:
        User: The newly created user object
        
    Raises:
        ValueError: If email or username is already taken
    """
    if await user_exists(db, email, username):
        raise ValueError("Email or username already taken")
    hashed = get_password_hash(password)
    return await register_new_user(db, email, username, hashed)


async def login_user(
    db: AsyncSession,
    email: str,
    password: str
) -> dict:
    """
    Authenticate a user with email and password.
    
    Args:
        db: Async database session
        email: User's email address
        password: Plain text password to verify
        
    Returns:
        dict: JWT access and refresh tokens
        
    Raises:
        ValueError: If credentials are invalid or account is disabled
    """
    user = await get_user_for_login(db, email)
    if not user:
        raise ValueError("Invalid email or password")
    if not check_password(password, user.hashed_password):
        raise ValueError("Invalid email or password")
    if not user.is_active:
        raise ValueError("Account is disabled")
    return issue_tokens(str(user.id))


async def refresh_tokens(token: str) -> dict:
    """
    Issue a new token pair using a valid refresh token.
    
    Args:
        token: A valid refresh JWT token
        
    Returns:
        dict: New JWT access and refresh tokens
        
    Raises:
        ValueError: If token is invalid or not a refresh token
    """
    from app.core.security import verify_token
    payload = verify_token(token)
    if payload.get("type") != "refresh":
        raise ValueError("Invalid token type")
    return issue_tokens(payload["sub"])