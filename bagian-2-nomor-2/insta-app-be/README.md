<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## Insta App - Backend

- PHP 8.2
- Laravel 11
- Use build in SQLite
- Docker supported

### Unit testing
```bash
php artisan test
```

### Local dev
```bash
cp .env.example .env
# generate APP_KEY inside .env
php artisan key:generate
php artisan serve --host=0.0.0.0 --port=8000
./local-test.sh
```

### Docker
```bash
docker compose up --build -d
```

### Notes
- see API spec on API_SPEC.md
- database table already migrated. located at database/database.sqlite

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
