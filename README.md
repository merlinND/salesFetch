# salesFetch
[![Build Status](https://travis-ci.org/Papiel/salesFetch.svg?branch=coveralls)](https://travis-ci.org/Papiel/salesFetch)
[![Coverage Status](https://coveralls.io/repos/Papiel/salesFetch/badge.png)](https://coveralls.io/r/Papiel/salesFetch)

Fetch API integration in Salesforce.

* Provides components integration in salesforce
* 2 ways : timeline views and search views
* Dynamic request management


## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm
* MongoDB - Download and Install [MongoDB](http://www.mongodb.org/downloads) - Make sure it's running on the default port (27017).

### Tools Prerequisites
* NPM - Node.js package manager, should be installed when you install node.js.
* Bower - Web package manager, installing [Bower](http://bower.io/) is simple when you have npm:

```
$ npm install -g bower
$ npm install -g grunt
```

## Quick Install

*Note:* A `CONSUMER_KEY` and a `CONSUMER_SECRET` is needed to launch the server, these keys are provided by salesforce.
To request authentication keys, you'll need to setup a connected application through the developer panel.


Install dependencies:
```
  $ npm install
```

You shoud now be able to launch the server with:
```
  $ grunt
```

The server in now available on `https://localhost:3000`. The `https` is important for securing the connection between salesFetch and Salesforce.

## SalesForce project management
You can use [MavensMate](http://mavensmate.com/) and the integration into the SublimText3 text editor to manage the Apex code. To connect an existing project to the plugin [use this link](http://mavensmate.com/Plugins/Sublime_Text/Existing_Projects).
