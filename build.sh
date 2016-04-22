#!/bin/sh
uglifyjs js/sha1.js shared.js -m -c -o shared.min.js
uglifyjs js/jquery.js js/ui.js js/highcharts.js app.js -m -c -o desktop.min.js
#uglifyjs mobile.js -m -c -o mobile.min.js
