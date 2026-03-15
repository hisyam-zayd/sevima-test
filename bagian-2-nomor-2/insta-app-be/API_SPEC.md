# InstaApp API Specification

- Base URL: `http://localhost:8000/api`
- Auth Header: `Authorization: Bearer {token}`

---

## 1. AUTHENTICATION

### Register
- `POST /register`
- Body example:
```json
{ 
    "name": "oowi",
    "email": "oowi@example.com",
    "password": "nyawit123"
}
```
- Response example:
```json
{ 
    "user": {...},
    "token": "..."
}
```

### Login
- `POST /login`
- Body example:
```json
{ 
    "email": "oowi@example.com",
    "password": "nyawit123"
}
```
- Response example:
```json
{
    "user": {...},
    "token": "..."
}
```

### Logout
- `POST /logout`
- Auth: Required
- Response example: `204 No Content`

---

## 2. POSTS

### Get All Posts
- `GET /posts`
- Auth: Required
- Response example:
```json
[ 
    { 
        "id": 1,
        "content": "...",
        "user": {...}
    },
]
```

### Create Post
- `POST /posts`
- Auth: Required
- Body example:
```json
{
    "content": "pria itu lagi!",
    "image": "optional"
}
```
- Response example:
```json
{
    "id": 1,
    "content": "pria itu lagi!"
}
```

### Update Post
- `PUT /posts/{id}`
- Auth: Required (Owner only)
- Body example:
```json
{
    "content": "saya akan kembali menjadi rakyat biasa"
}
```
- Response example:
```json
{
    "id": 1,
    "content": "saya akan kembali menjadi rakyat biasa"
}
```

### Delete Post
- `DELETE /posts/{id}`
- Auth: Required (Owner only)
- Response example: `204 No Content`

---

## 3. COMMENTS

### Get Comments
- `GET /comments?post_id={id}`
- Auth: Required
- Response example:
```json
[ 
    { 
        "id": 1,
        "content": "...",
        "user": {...}
    }
]
```

### Create Comment
- `POST /comments`
- Auth: Required
- Body example:
```json
{
    "post_id": 1,
    "content": "tembok ratapan oslo"
}
```
- Response example: 
```json
{
    "id": 1,
    "content": "tembok ratapan oslo"
}
```

### Update Comment
- `PUT /comments/{id}`
- Auth: Required (Owner only)
- Body example:
```json
{
    "content": "jangan masuk gorong-gorong lagi ya"
}
```
- Response example:
```json
{
    "id": 1,
    "content": "jangan masuk gorong-gorong lagi ya"
}
```

### Delete Comment
- `DELETE /comments/{id}`
- Auth: Required (Owner only)
- Response example: `204 No Content`

---

## 4. LIKES

### Get Likes
- `GET /likes?post_id={id}`
- Auth: Required
- Response example:
```json
[
    {
        "id": 1,
        "user_id": 1,
        "post_id": 1
    }
]
```

### Like Post
- `POST /likes`
- Auth: Required
- Body example:
```json
{
    "post_id": 1
}
```
- Response example:
```json
{
    "id": 1,
    "user_id": 1,
    "post_id": 1
}
```

### Unlike Post
-`DELETE /likes/{id}`
- Auth: Required
- Body example:
```json
{ 
    "post_id": 1
}
```
- Response example: `204 No Content`
