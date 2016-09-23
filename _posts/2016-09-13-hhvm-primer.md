---
layout: post
title: HHVM Primer
---

> A HipHopsters Guide To WebDev with Facebook's HHVM / My scratchpad for development with HHVM on Apache and NGINX

# Useful Commands

## Clean Verbose Logs:

HHVM produces a lot of garbage in verbose mode; notably the `f_is_{file,dir}`

```bash
tail -f /var/log/hhvm/error.log | grep --line-buffered -v f_is_
```

## Almighty Restart

Restarting Apache, HHVM, and monitoring the error log while removing Verbose `f_is_{file,dir}` junk

```bash
sudo service hhvm restart && sudo service apache2 restart && tail -f /var/log/hhvm/error.log | grep --line-buffered -v f_is_
```

## Update classes (eZ)

```bash
php ezpublish/console ezpublish:legacy:script bin/php/ezpgenerateautoloads.php --extension
```

## Enabling mod_php

```bash
sudo su
a2dismod mpm_worker proxy_fcgi
a2enmod mpm_prefork php5
apachectl configtest
service hhvm stop
service apache2 restart
/var/www/bin/clearcache.sh
exit
```

note: You must disable geoip php plugin

## Enabling HHVM

```bash
sudo su
a2dismod mpm_prefork php5
a2enmod mpm_worker proxy_fcgi
apachectl configtest
service hhvm start
service apache2 restart
/var/www/bin/clearcache.sh
exit
```

## server.ini

```ini
; php options

pid = /var/run/hhvm/pid

; hhvm specific

hhvm.server.request_memory_max_bytes=8096M
hhvm.server.port = 9000
hhvm.server.type = fastcgi
hhvm.server.default_document = index.php
hhvm.log.use_log_file = true
hhvm.log.file = /var/log/hhvm/error.log
hhvm.repo.central.path = /var/run/hhvm/hhvm.hhbc
hhvm.libxml.ext_entity_whitelist=file,http

; debugging
hhvm.jit_profile_interp_requests=1
hhvm.server.implicit_flush = true
hhvm.log.level=Verbose
hhvm.log.header=true
hhvm.log.native_stack_trace = true
hhvm.debug.native_stack_trace = true
hhvm.debug.server_error_message = true
hhvm.server.implicit_flush = true

xdebug.enable=1
xdebug.remote_enable=1
xdebug.remote_connect_back=1
xdebug.remote_autostart=1
xdebug.remote_host="0.0.0.0"
xdebug.remote_port=9999
```

# Issues

## Craft

### Image uploads

Craft can't seem to detect the HHVM `post_max_size` ini setting; likely an issue with Craft client JS and NGINX/HHVM combination.

<https://github.com/facebook/hhvm/issues/4993>

`/lib/patch.php`:

```php
<?php

require_once __DIR__ . '/../vendor/antecedent/patchwork/Patchwork.php';
require __DIR__ . '/../craft/app/variables/AppVariable.php';
require __DIR__ . '/../craft/app/helpers/AppHelper.php';

/*
 * Redefine getMaxUploadSize for AppVariable due to Craft incompatibility with HHVM ini.
 */
Patchwork\redefine(['\Craft\AppVariable', 'getMaxUploadSize'], function () {
  $maxUpload = ini_get('hhvm.server.upload.upload_max_file_size');
  $maxPost = ini_get('hhvm.server.max_post_size');
  $memoryLimit = ini_get('memory_limit');

  $uploadInBytes = min($maxUpload, $maxPost);

  if ($memoryLimit > 0) {
      $uploadInBytes = min($uploadInBytes, $memoryLimit);
  }

  return $uploadInBytes;
});
```

### Exceptions Handling

HHVM handles deconstructors somewhat differently from Zend. Yii/Craft uses deconstructors for exception handling. Wrap the app in a try/catch and manually call Crafts exception handler, passing the Exception

<https://docs.hhvm.com/hhvm/inconsistencies/classes-and-objects#exceptions-thrown-from-destructors>

`/public/index.php`:

```php
<?php

...

try {

  // Path to your craft/ folder
  $craftPath = '../craft';

  // Do not edit below this line
  $path = rtrim($craftPath, '/').'/app/index.php';

  if (!is_file($path))
  {
    if (function_exists('http_response_code'))
    {
      http_response_code(503);
    }

    exit('Could not find your craft/ folder. Please ensure that <strong><code>$craftPath</code></strong> is set correctly in '.__FILE__);
  }

  require $craftPath . '/config/environment_vars.php';

  require_once $path;
} catch (Exception $exception) {
  $method = new ReflectionMethod('\Craft\ErrorHandler', 'handleException');
     $method->setAccessible(true);
     $method->invoke(new \Craft\ErrorHandler, $exception);
     //var_dump($e);
}
```
