# FastAPI dependency injectors — injected into route handlers
#
# get_db()            yields an async DB session
# get_current_user()  decodes JWT and returns the authenticated User
# rate_limit_check()  checks Redis counter and raises 429 if exceeded
