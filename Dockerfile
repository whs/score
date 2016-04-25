FROM alpine:3.3
ADD .  /root/score
RUN apk add --update apache2 php-apache2 php-json php-iconv nodejs \
	&& mkdir /run/apache2 \
	&& cd /root/score \
	&& npm install \
	&& node_modules/.bin/gulp \
	&& cp -r dist/* dist/.htaccess /var/www/localhost/htdocs \
	&& chown apache -R /var/www/localhost/htdocs/input /var/www/localhost/htdocs/data \
	&& cd / && rm -r /root/score \
	&& apk del nodejs \
	&& rm -rf /var/cache/apk/* \
	&& echo -e '<Directory "/var/www/localhost/htdocs">\nAllowOverride All\n</Directory>' > /etc/apache2/conf.d/allowoverride.conf
ENTRYPOINT ["/usr/sbin/httpd", "-D", "FOREGROUND"]
EXPOSE 80
