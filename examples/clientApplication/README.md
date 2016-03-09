## Client Application

This example is used to test and demonstrate the meteor-oauth2-client package
and it's interaction with a meteor service running the
meteor-oauth2-server package. This example expects that the resourceServer
application is also running. Check the example directory for details.

=========================================
#### Installation

Starting:
``` sh
meteor --port 3200
```
After it is started, goto http://localhost:3200 and walk through the steps.

The reason we are using a specific port here is to:
 1. Not interfere with your running instance of meteor.
 2. Work well with the resourceServer example as it assumes this application
will be hosted at localhost:3200

=========================================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
