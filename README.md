Hoodie command line utility [![Build Status](https://travis-ci.org/hoodiehq/hoodie-cli.png)](https://travis-ci.org/hoodiehq/hoodie-cli)
======


[![NPM](https://nodei.co/npm/hoodie-cli.png)](https://nodei.co/npm/hoodie-cli/)


## Installation
Please ensure you have [node](http://nodejs.org) installed.

```
npm install -g hoodie-cli
```

## Usage

See `hoodie -h` for information.

```
hoodie new <appname> [-t <template>]
```
Creates a new hoodie app inside a new folder called `appname`. `appname` will also be your domain. If template is not set it will use the default repository `hoodiehq/my-first-hoodie`.

```
hoodie start
```
Starts the hoodie app. The same as `npm start`.

```
hoodie install <plugin>
hoodie uninstall <plugin>
```
Un-/Installs a hoodie dependency via `npm`. Plugins are installed from the [hoodie github account](http://github.com/hoodiehq) with a `plugin-` prefix, e.g.:
```
hoodie install global-share
# Cloned from https://github.com/hoodiehq/global-share
```

#### Running hoodie as a daemon 

Using `forever` 

```bash
forever start -o /var/log/app.out.log -e /var/log/app.err.log -a --killSignal=SIGTERM /path/to/myapp/node_modules/hoodie-server/bin/start
```



