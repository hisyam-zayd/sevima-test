# Tes SEVIMA Fullstack Developer - Bagian 1 nomor 1

Repositori ini memuat *Proof of Concept* (PoC) untuk menyimpan dan melakukan operasi aritmetika pada angka raksasa (hingga 2048-bit / ~617 digit desimal) secara efisien tanpa kehilangan presisi akibat *Integer Overflow*.

Solusi ini mendemonstrasikan metode **Bignum Math (GMP)** di level aplikasi (PHP) dan tipe data **NUMERIC** di level database (PostgreSQL).

## Requirement
- Docker & Docker Compose

## How To

### Langkah 1: Build dan Jalankan Container
Jalankan perintah berikut untuk mem-build *image* PHP (dengan ekstensi GMP & PDO) dan menjalankan PostgreSQL di *background*.

```bash
docker compose up --build -d
```

lalu tes poc dengan command seperti ini:

```bash
docker compose exec app php 1-math-poc.php
docker compose exec app php 2-db-poc.php
```