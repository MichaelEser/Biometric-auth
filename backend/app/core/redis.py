# Redis async client singleton
# Helpers:
#   blacklist_token(jti)       — add token ID to blacklist
#   is_token_blacklisted(jti)  — check if token is revoked
#   increment_rate_limit(key)  — increment request counter with TTL
