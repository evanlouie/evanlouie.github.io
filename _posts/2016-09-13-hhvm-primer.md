---
layout: post
title: HHVM Primer
tags: hhvm php apache nginx
excerpt: "Internally at Hootsuite, we at the WebDev team have adopted HHVM as a means to improve the performance of our older PHP code. Unable to hot swap PHP7 without breaking third party vendor code and HHVM having full PHP5\\* support made swap very worth while. However that is not to say HHVM hasn't given me or my team any headaches. There have been plenty... segfaults anyone? Here is my scratchpad/notes for using HHVM."
---

> A HipHopsters Guide To WebDev with Facebook's HHVM / My scratchpad for development with HHVM on Apache and NGINX

Internally at Hootsuite, we at the WebDev team have adopted HHVM as a means to improve the performance of our older PHP code. Unable to hot swap PHP7 without breaking third party vendor code and HHVM having full PHP5\* support made swap very worth while.

However that is not to say HHVM hasn't given me or my team any headaches. There have been plenty... segfaults anyone?

Here is my scratchpad/notes for using HHVM.

# Contents

{:.no_toc}

- Will be replaced with the ToC, excluding the "Contents" header
  {:toc}

# Useful Commands

## Clean Verbose Logs:

HHVM produces a lot of garbage logs in verbose mode; notably the `f_is_{file,dir}`. Do an inverse grep to filter them out

```bash
tail -F /var/log/hhvm/error.log | grep --line-buffered -v f_is_
```

## Almighty Restart

HHVM can sometimes be stubborn and refuse to recompile changed code. Restarting the service will force it to reevaluate all code. Usually having my logs open as I dev, I reopen filtered logs as soon as it restarts. I actually alias this command `hh_restart` and is probably one of my most used commands during development.

```bash
sudo service hhvm restart && sudo service apache2 restart && tail -F /var/log/hhvm/error.log | grep --line-buffered -v f_is_
```

## Enabling mod_php

On one my teams older platforms, we migrated from PHP56/mod_php to HHVM/FastCGI on Apache. I often find myself having to switch between PHP56 mod_php and HHVM FastCGI in development just for testing and general backwards compatibility testing.

```bash
sudo su
a2dismod mpm_worker proxy_fcgi
a2enmod mpm_prefork php5
apachectl configtest
service hhvm stop
service apache2 restart
exit
```

## Enabling HHVM/FastCGI

Reenabling HHVM/FastCGI is, of course, just as common

```bash
sudo su
a2dismod mpm_prefork php5
a2enmod mpm_worker proxy_fcgi
apachectl configtest
service hhvm start
service apache2 restart
exit
```

# My Setup

## server.ini

When you first start using HHVM, there server.ini and php.ini settings files can be quite annoying to setup. Here is my setup for general development.

Note: you will incur a heavy performance penalty for having `hhvm.jit_profile_interp_requests`, `hhvm.server.implicit_flush`, and `xdebug.enable` set to true

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
hhvm.jit_profile_interp_requests = true
hhvm.server.implicit_flush = true
hhvm.log.level=Verbose
hhvm.log.header=true
hhvm.log.native_stack_trace = true
hhvm.debug.native_stack_trace = true
hhvm.debug.server_error_message = true

xdebug.enable=1
xdebug.remote_enable=1
xdebug.remote_connect_back=1
xdebug.remote_autostart=1
xdebug.remote_host="0.0.0.0"
xdebug.remote_port=9999
```

## proxygen.ini

Often times I find myself running having to develop HHVM along side standard PHP. This usually means I use mod_php on Apache and end up giving it my main dev port. Setting up multiple ports and virtual hosts in Apache/Nginx and juggling between FastCGI ports in server.ini can be annoying. One solution is to just start up HHVM's built in HTTP server; Proxygen.

```ini
; php options

pid = /var/run/hhvm/pid
session.save_handler = redis
session.save_path = "tcp://127.0.0.1:6379"
session.gc_maxlifetime = 1440

; hhvm specific

hhvm.pid_file = /var/run/hhvm/pid

hhvm.server.type = proxygen
hhvm.server.port = 8888
hhvm.server.source_root=/var/www/web/

;hhvm.server.default_document = index.php
;hhvm.log.use_log_file = true
;hhvm.log.file = /var/log/hhvm/error.log
hhvm.log.header = true
hhvm.libxml.ext_entity_whitelist = file,http

;; debug
hhvm.log.level = Verbose
hhvm.log.native_stack_trace = true
hhvm.debug.native_stack_trace = true
hhvm.debug.server_error_message = true
hhvm.server.implicit_flush = true
```

```bash
hhvm -m s -c /etc/hhvm/proxygen.ini | grep --line-buffered -v f_is
```

This will start up a Proxygen listening to port 8888 and grep the verbose logs for clean output

# Issues/Gotchas

## General

### Broken PHP ini getters

Several PHP ini retrieval functions fail by default. In order to make them work, you have to disable an [UNDOCUMENTED](https://docs.hhvm.com/hhvm/configuration/INI-settings)
ini config option:

```ini
hhvm.enable_zend_ini_compat = false
```

<https://github.com/facebook/hhvm/issues/4993>

## HHVM Doesn't Ship With GeoIP

Unlike most vanilla PHP distros, HHVM doesn't ship with the GeoIP plugin. As such, if your actively switching between HHVM and vanilla PHP, you're going to want to disable your PHP's GeoIP (comment out the geoip.so in `/etc/path/to/php/mods-available/geoip.ini`) and install your own with composer.

## CraftCMS

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
