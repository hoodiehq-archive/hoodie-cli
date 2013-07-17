
Hoodie command line utility
======

[![Build Status](https://travis-ci.org/hoodiehq/hoodie-cli.png)](https://travis-ci.org/hoodiehq/hoodie-cli)

The [hoodie](http://hood.ie) cli.

## Installation
Please ensure you have [node](http://nodejs.org) installed.

```
npm install -g hoodie-cli
```

## Usage

See `hoodie -h` for information.

```
hoodie new <appname> [<template>]
```
Creates a new hoodie app inside a new folder called `appname`. `appname` will also be your domain. If template is not set it will use the default repository `hoodiehq/my-first-hoodie`.
Sometimes the process stops at `npm WARN package.json hoodie-worker-email-out@0.3.4 No README.md file found!`. But don't mind and quit the process, all dependencies are installed, that's just a wired npm bug.

```
hoodie start
```
Starts the hoodie app. The same as `npm start`.

```
hoodie install <module>
hoodie uninstall <module>
```
Un-/Installs a hoodie dependency via `npm`. Modules are installed from the [hoodie github account](http://github.com/hoodiehq) with a `worker-` prefix, e.g.:
```
hoodie install email-in
# Cloned from https://github.com/hoodiehq/worker-email-in
```
