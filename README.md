# salesFetch

Fetch API integration in Salesforce.

* Provides components integration in salesforce
* 2 ways : timeline views and search views
* Dynamic request management

# Setup

You'll need `nodejs` to run the server. Use `nodemon` in development mode.

A `CONSUMER_KEY` and a `CONSUMER_SECRET` is needed to launch the server, these keys are provided by salesforce.
To request authentication keys, you'll a to setup a connected application throught the developer panel.

```
  $ nodemon app.js                          # Start the server in dev mode
```

The server in now available on `https://localhost:<port>`. The `https`is important for securing the connection between salesFetch and Salesforce.