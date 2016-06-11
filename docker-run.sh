#!/bin/sh

set -e

GULP=`dirname $0`/node_modules/.bin/gulp

if [ "$BRANDING" = "" -o "$PASSWORD" = "" ]; then
	echo "Invalid configuration"
	echo "Launch this container with -e \"BRANDING=Your school name\" -e PASSWORD=hackme"
	echo
	echo "Available environments variables:"
	echo "- SYSTEM: System name (title). Defaults to ระบบประกาศผลคะแนนสอบ"
	echo "- BRANDING: Your name (subtitle) REQUIRED"
	echo "- PASSWORD: Admin password REQUIRED"
	echo "- USE_CDN: Set to false to use local JavaScript file. Defaults to true (recommended)"
	exit 1
fi

cd `dirname $0`
$GULP generate-config
$GULP

cp -r dist/* dist/.htaccess /var/www/localhost/htdocs
chown apache -R /var/www/localhost/htdocs/input /var/www/localhost/htdocs/data
exec /usr/sbin/httpd -D FOREGROUND
