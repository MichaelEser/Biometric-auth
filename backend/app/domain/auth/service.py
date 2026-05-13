# Auth business logic:
#   register_user()    — hash password, create user, issue tokens
#   login_user()       — verify credentials, check biometric, return tokens
#   refresh_tokens()   — validate refresh token, issue new pair
#   logout_user()      — blacklist access + refresh tokens in Redis
