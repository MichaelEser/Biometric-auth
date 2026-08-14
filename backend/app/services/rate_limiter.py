# Redis-backed rate limiter
# Limits auth endpoints to N requests per IP per minute
# Returns 429 Too Many Requests when exceeded
from fastapi import HTTPException, Request, status
from app.core.redis import get_redis

async def rate_limit(request: Request, limit: int = 5, window: int = 60):
    client_ip = request.client.host
    key = f"rate_limit:{client_ip}:{request.url.path}"
    
    redis = await get_redis()
    count = await redis.incr(key)
    
    if count == 1:
        await redis.expire(key, window)
    
    if count > limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many requests. Try again in {window} seconds."
        )