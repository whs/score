FROM alpine:3.3
RUN apk add --update apache2 php-apache2 php-json \
	&& rm -rf /var/cache/apk/* \
	&& mkdir /run/apache2
# DirectoryIndex Off
# AllowOverride All
