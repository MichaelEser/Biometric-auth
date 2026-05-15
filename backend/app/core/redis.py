# Redis async client singleton
# Helpers:
#   blacklist_token(jti)       — add token ID to blacklist
#   is_token_blacklisted(jti)  — check if token is revoked
#   increment_rate_limit(key)  — increment request counter with TTL
import redis.asyncio as redis
from app.core.config import settings

_redis_client = None

async def get_redis():
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis_client

async def blacklist_token(jti: str, expires_in: int):
    client = await get_redis()
    await client.setex(f"blacklist:{jti}", expires_in, "1")

async def is_token_blacklisted(jti: str) -> bool:
    client = await get_redis()
    result = await client.get(f"blacklist:{jti}")
    return result is not None