# Insta App

## How to run

```bash
# Build dan run BE + FE
docker compose up -d --build

# Run BE + FE, only build FE
docker compose up -d --build fe

# Run BE + FE, only build BE
docker compose up -d --build be

# only FE
docker compose up -d fe

# only BE
docker compose up -d be
```

## Logs

```bash
docker compose logs -f fe
docker compose logs -f be
```
