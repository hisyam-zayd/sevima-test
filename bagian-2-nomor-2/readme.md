# Insta App

## Jalankan

```bash
# Build dan jalankan BE + FE
docker compose up -d --build

# Jalankan BE + FE, hanya build FE
docker compose up -d --build fe

# Jalankan BE + FE, hanya build BE
docker compose up -d --build be

# Jalankan FE saja
docker compose up -d fe

# Jalankan BE saja
docker compose up -d be
```

## Logs

```bash
docker compose logs -f fe
docker compose logs -f be
```
