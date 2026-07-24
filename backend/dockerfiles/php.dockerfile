FROM php:8.5-fpm-alpine

# ----------------------------------------------
# USER CONFIG
# ----------------------------------------------
ARG UID
ARG GID

ENV UID=${UID}
ENV GID=${GID}

# ----------------------------------------------
# System dependencies
# ----------------------------------------------
RUN apk add --no-cache \
        curl \
        git \
        freetype-dev \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libpq-dev \
        libwebp-dev \
        libzip-dev \
        oniguruma-dev\
        unzip \
        zip

# ----------------------------------------------
# Create workdir
# ----------------------------------------------
RUN mkdir -p /var/www/html
WORKDIR /var/www/html

# ----------------------------------------------
# Install composer
# ----------------------------------------------
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# ----------------------------------------------
# Set user
# ----------------------------------------------
# MacOS staff group's gid is 20, so is the dialout group in alpine linux. We're not using it, let's just remove it.
RUN delgroup dialout

RUN addgroup -g ${GID} --system laravel
RUN adduser -G laravel --system -D -s /bin/sh -u ${UID} laravel

RUN sed -i "s/user = www-data/user = laravel/g" /usr/local/etc/php-fpm.d/www.conf
RUN sed -i "s/group = www-data/group = laravel/g" /usr/local/etc/php-fpm.d/www.conf
RUN echo "php_admin_flag[log_errors] = on" >> /usr/local/etc/php-fpm.d/www.conf

# ----------------------------------------------
# PHP Extensions: PDO, Zip, GD, etc.
# ----------------------------------------------
# PDO
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql

# Zip
RUN docker-php-ext-install zip

# GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install gd

# mbstring, exif, pcntl, bcmath, calendar, intl
RUN docker-php-ext-install mbstring exif pcntl bcmath calendar intl

# ----------------------------------------------
# Install Redis extension from source
# ----------------------------------------------
RUN mkdir -p /usr/src/php/ext/redis \
    && curl -L https://github.com/phpredis/phpredis/archive/6.3.0.tar.gz \
    | tar xvz -C /usr/src/php/ext/redis --strip 1 \
    && echo 'redis' >> /usr/src/php-available-exts \
    && docker-php-ext-install redis

# ----------------------------------------------
# Install Imagick extension from source
# ----------------------------------------------
USER laravel

# ----------------------------------------------
# Install Imagick extension from source
# ----------------------------------------------
CMD ["php-fpm", "-y", "/usr/local/etc/php-fpm.conf", "-R"]
