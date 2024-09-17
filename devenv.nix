{ pkgs, lib, config, inputs, ... }:

{
	cachix.enable = false;
	languages.php = {
		enable = true;
		# Use oldest PHP we support
		package = pkgs.php82.buildEnv {
			apxs2Support = true;
			apacheHttpd = pkgs.apacheHttpd;
		};
		extensions = [ "session" "ctype" "iconv" "pcre" "simplexml" "tokenizer" "dom" ];
	};
	env.PHPRC = "${config.languages.php.package}/lib/php.ini";
	languages.javascript = {
		enable = true;
		npm.enable = true;
	};
	processes = {
		httpd = let
			port = 8080;
			httpdConfig = ''
			ServerRoot "${config.env.DEVENV_STATE}/httpd/"
			PidFile "${config.env.DEVENV_STATE}/httpd/apache.pid"
			
			LoadModule mpm_prefork_module ${pkgs.apacheHttpd}/modules/mod_mpm_prefork.so
			LoadModule dir_module ${pkgs.apacheHttpd}/modules/mod_dir.so
			LoadModule rewrite_module ${pkgs.apacheHttpd}/modules/mod_rewrite.so
			LoadModule authn_core_module ${pkgs.apacheHttpd}/modules/mod_authn_core.so
			LoadModule authz_core_module ${pkgs.apacheHttpd}/modules/mod_authz_core.so
			LoadModule auth_basic_module ${pkgs.apacheHttpd}/modules/mod_auth_basic.so
			LoadModule deflate_module ${pkgs.apacheHttpd}/modules/mod_deflate.so
			LoadModule brotli_module ${pkgs.apacheHttpd}/modules/mod_brotli.so
			LoadModule unixd_module ${pkgs.apacheHttpd}/modules/mod_unixd.so
			LoadModule log_config_module ${pkgs.apacheHttpd}/modules/mod_log_config.so
			LoadModule mime_module ${pkgs.apacheHttpd}/modules/mod_mime.so
			LoadModule reqtimeout_module ${pkgs.apacheHttpd}/modules/mod_reqtimeout.so
			LoadModule php_module ${config.languages.php.package}/modules/libphp.so
			
			Listen *:${toString port}
			DocumentRoot "${config.env.DEVENV_ROOT}/backend"
			DirectoryIndex index.html index.php
			AccessFileName .htaccess
			ServerTokens Prod
			ServerSignature Off
			RequestReadTimeout header=20-40,MinRate=500 body=20,MinRate=500

			ErrorLog "logs/error_log"
			LogLevel warn
			LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
			CustomLog "logs/access_log" combined

			TypesConfig ${pkgs.apacheHttpd}/conf/mime.types
			AddType application/x-httpd-php    .php .phtml

			Timeout 60
			KeepAlive On
			MaxKeepAliveRequests 100
			KeepAliveTimeout 5

			<Directory />
				AllowOverride None
				Require all denied
			</Directory>

			<Directory "${config.env.DEVENV_ROOT}">
				AllowOverride All
				Require all granted
			</Directory>

			<Files ".ht*">
				Require all denied
			</Files>

			<Files "*.php">
				SetHandler application/x-httpd-php
			</Files>
			'';
			httpdConfigFile = pkgs.writeText "httpd.conf" httpdConfig;
		in {
			exec = ''
				mkdir -p ${config.env.DEVENV_STATE}/httpd/logs/ || true
				${pkgs.apacheHttpd}/bin/httpd -DFOREGROUND -f ${httpdConfigFile}
			'';
			process-compose = {
				readiness_probe = {
					exec.command = "${pkgs.curl}/bin/curl -f -k http://127.0.0.1:${toString port}";
				};
				shutdown = {
					command = "${pkgs.apacheHttpd}/bin/apachectl -f ${httpdConfigFile} -k graceful-stop";
				};
				availability.restart = "on_failure";
			};
		};
	};
}
