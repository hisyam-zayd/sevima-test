<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## Insta App - Backend

- PHP 8.2
- Laravel 11
- Use build in SQLite
- Docker supported

### Installing
```bash
composer install
# install or enable php extension mentioned if below command is failed
cp .env.example .env
php artisan migrate
# generate APP_KEY inside .env
php artisan key:generate
```

### Local dev
```bash
php artisan serve --host=0.0.0.0 --port=8000
./local-test.sh
```

### Unit testing
```bash
php artisan test
```

### Docker
```bash
# don't forget to recreate database.sqlite for each build with php artisan migrate - in case of it already filled up with dev data
rm -f database/database.sqlite
php artisan migrate
docker compose up --build -d
```

### Notes
- see API spec on API_SPEC.md
- to use Docker and with compose, don't forget to generate key (APP_KEY) and do database migration with `php artisan migrate`. compose file needs these two properties as app env.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
