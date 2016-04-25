FROM alpine:3.3
RUN apk add --update apache2 php-apache2 php-json php-iconv \
	&& rm -rf /var/cache/apk/* \
	&& mkdir /run/apache2
RUN chown apache -R /var/www/localhost/htdocs/input /var/www/localhost/htdocs/data
# DirectoryIndex Off
# AllowOverride All
