## ResourceServer  

This example is used to test the meteor-oauth2-server package.
It can also be used as a demonstration of how to integrate oauth2
into your own application. The code is well documented, so it should
be fairly easy to follow and implement your own solution. Pay
particular attention to server/rest.js and client/index.js for how
to create authorization codes and use access tokens in a rest service.

=========================================
#### Installation

Starting:

``` sh
meteor --port 3100
```
After it is started, goto http://localhost:3100 and walk through the steps.

The reason we are using a specific port here is to:
 1. Not interfere with your running instance of meteor.
 2. Work well with the clientApplication example as it assumes the resourceServer
will be hosted at localhost:3100

=========================================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
