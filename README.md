# salesFetch

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
```

### Optional
* Grunt - Download and Install [Grunt](http://gruntjs.com).



## Quick Install

*Note:* A `CONSUMER_KEY` and a `CONSUMER_SECRET` is needed to launch the server, these keys are provided by salesforce.
To request authentication keys, you'll a to setup a connected application throught the developer panel.


Intstall dependences:
```
  $ npm install
```

If you have the change to have `grunt` installed, you can launch the server with:
```
  $ grunt
```

or run
```
  $ node app.js
```

The server in now available on `https://localhost:<port>`. The `https`is important for securing the connection between salesFetch and Salesforce.