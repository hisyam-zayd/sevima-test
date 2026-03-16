FROM php:8.2-fpm

ARG user=laravel
ARG uid=1000

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libsqlite3-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl gd pdo_sqlite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -G www-data,root -u $uid -d /home/$user $user \
    && mkdir -p /home/$user/.composer \
    && chown -R $user:$user /home/$user

WORKDIR /var/www/html

COPY --chown=$user:$user . .

USER $user

RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

# temporary use dev, for easy deploy. for prd, don't use this approach. instead use php server like FrankenPHP
CMD php artisan storage:link --force && php artisan serve --host=0.0.0.0 --port=8000