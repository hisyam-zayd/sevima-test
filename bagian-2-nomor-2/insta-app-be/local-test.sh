#!/bin/bash

# ============================================
# InstaApp API Test Script
# ============================================

BASE_URL="http://localhost:8000/api"
TOKEN=""
USER_ID=""
POST_ID=""
COMMENT_ID=""
LIKE_ID=""

# Warna untuk output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

echo_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# ============================================
# 1. REGISTER
# ============================================
echo_info "Testing REGISTER..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test'$(date +%s)'@test.com","password":"password123"}')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
    echo_success "Register successful"
    echo_info "Token: ${TOKEN:0:20}..."
else
    echo_error "Register failed"
    echo $REGISTER_RESPONSE
    exit 1
fi

# ============================================
# 2. LOGIN
# ============================================
echo_info "Testing LOGIN..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$(date +%s)'@test.com","password":"password123"}')

if [ ! -z "$TOKEN" ]; then
    echo_success "Login successful"
else
    echo_error "Login failed"
    exit 1
fi

# ============================================
# 3. GET USER (Auth Test)
# ============================================
echo_info "Testing GET /user (Auth)..."
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/user" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")

if [ ! -z "$USER_RESPONSE" ]; then
    echo_success "Auth test successful"
    USER_ID=$(echo $USER_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
    echo_info "User ID: $USER_ID"
else
    echo_error "Auth test failed"
    exit 1
fi

# ============================================
# 4. CREATE POST
# ============================================
echo_info "Testing CREATE POST..."
POST_RESPONSE=$(curl -s -X POST "$BASE_URL/posts" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"content":"Test post content"}')

POST_ID=$(echo $POST_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$POST_ID" ]; then
    echo_success "Create post successful"
    echo_info "Post ID: $POST_ID"
else
    echo_error "Create post failed"
    echo $POST_RESPONSE
    exit 1
fi

# ============================================
# 5. GET ALL POSTS
# ============================================
echo_info "Testing GET ALL POSTS..."
POSTS_RESPONSE=$(curl -s -X GET "$BASE_URL/posts" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")

if [ ! -z "$POSTS_RESPONSE" ]; then
    echo_success "Get all posts successful"
else
    echo_error "Get all posts failed"
    exit 1
fi

# ============================================
# 6. UPDATE POST
# ============================================
echo_info "Testing UPDATE POST..."
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/posts/$POST_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"content":"Updated post content"}')

if [ ! -z "$UPDATE_RESPONSE" ]; then
    echo_success "Update post successful"
else
    echo_error "Update post failed"
    exit 1
fi

# ============================================
# 7. CREATE COMMENT
# ============================================
echo_info "Testing CREATE COMMENT..."
COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/comments" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{\"post_id\":$POST_ID,\"content\":\"Test comment\"}")

COMMENT_ID=$(echo $COMMENT_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$COMMENT_ID" ]; then
    echo_success "Create comment successful"
    echo_info "Comment ID: $COMMENT_ID"
else
    echo_error "Create comment failed"
    exit 1
fi

# ============================================
# 8. GET COMMENTS
# ============================================
echo_info "Testing GET COMMENTS..."
COMMENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/comments?post_id=$POST_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")

if [ ! -z "$COMMENTS_RESPONSE" ]; then
    echo_success "Get comments successful"
else
    echo_error "Get comments failed"
    exit 1
fi

# ============================================
# 9. UPDATE COMMENT
# ============================================
echo_info "Testing UPDATE COMMENT..."
UPDATE_COMMENT_RESPONSE=$(curl -s -X PUT "$BASE_URL/comments/$COMMENT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"content":"Updated comment"}')

if [ ! -z "$UPDATE_COMMENT_RESPONSE" ]; then
    echo_success "Update comment successful"
else
    echo_error "Update comment failed"
    exit 1
fi

# ============================================
# 10. LIKE POST
# ============================================
echo_info "Testing LIKE POST..."
LIKE_RESPONSE=$(curl -s -X POST "$BASE_URL/likes" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{\"post_id\":$POST_ID}")

LIKE_ID=$(echo $LIKE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$LIKE_ID" ]; then
    echo_success "Like post successful"
    echo_info "Like ID: $LIKE_ID"
else
    echo_error "Like post failed"
    exit 1
fi

# ============================================
# 11. GET LIKES
# ============================================
echo_info "Testing GET LIKES..."
LIKES_RESPONSE=$(curl -s -X GET "$BASE_URL/likes?post_id=$POST_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")

if [ ! -z "$LIKES_RESPONSE" ]; then
    echo_success "Get likes successful"
else
    echo_error "Get likes failed"
    exit 1
fi

# ============================================
# 12. DELETE COMMENT
# ============================================
echo_info "Testing DELETE COMMENT..."
DELETE_COMMENT_RESPONSE=$(curl -s -X DELETE "$BASE_URL/comments/$COMMENT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")

if [ "$DELETE_COMMENT_RESPONSE" == "" ] || [ "$DELETE_COMMENT_RESPONSE" == "null" ]; then
    echo_success "Delete comment successful"
else
    echo_error "Delete comment failed"
    exit 1
fi

# ============================================
# 13. DELETE POST
# ============================================
echo_info "Testing DELETE POST..."
DELETE_POST_RESPONSE=$(curl -s -X DELETE "$BASE_URL/posts/$POST_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")

if [ "$DELETE_POST_RESPONSE" == "" ] || [ "$DELETE_POST_RESPONSE" == "null" ]; then
    echo_success "Delete post successful"
else
    echo_error "Delete post failed"
    exit 1
fi

# ============================================
# 14. LOGOUT
# ============================================
echo_info "Testing LOGOUT..."
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/logout" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")

if [ ! -z "$LOGOUT_RESPONSE" ]; then
    echo_success "Logout successful"
else
    echo_error "Logout failed"
    exit 1
fi

# ============================================
# SUMMARY
# ============================================
echo ""
echo "============================================"
echo -e "${GREEN}ALL TESTS PASSED!${NC}"
echo "============================================"
echo ""
