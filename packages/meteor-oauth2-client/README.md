# Meteor OAuth2 client
Used in conjunction with meteor-oauth2-server on the the target server, this
package will allow your site to authenticate users on another meteor application.

## Usage

### Configuration
Since every Meteor application is different, there is not a universal approach
to get your site setup as an oauth client. If you operate the target server,
you can add a client following the example provided on [this example](https://github.com/prime-8-consulting/meteor-oauth2/blob/master/examples/resourceServer/server/index.js).

If you do not operate the target server, your best bet is to contact the site
operator and provide them with your redirect uri. It will be <your base url>/_oauth/meteor-oauth2-server.

Once you have your client setup on the resource owner, you are ready to
get things running on your application.

#### Add a service configuration
##### The easy way
The easiest solution is to use the meteor UI. After starting your application
goto a page where the login button appear and click on the red configure button
for MeteorOAuth2Server.

##### The difficult way
Alternatively, you could manually create the service configuration
Note: Looking for a better way to handle this. Perhaps using meteor's config files? File an issue with your ideas.
```
$ meteor add service-configuration
```

``` javascript
ServiceConfiguration.configurations.remove({
  service: 'MeteorOAuth2Server'
});

ServiceConfiguration.configurations.insert({
  service: 'MeteorOAuth2Server',
  clientId: '{ your client id, provided by resource owner }',
  scope: [], // whatever scope the resource owner supports. By default, ['email'] will be used.
  secret: '{ your app\'s secret, provided by resource owner }',
  baseUrl: '{ the base url of the resource owner\'s site. }',
  loginUrl: '{ the login url of the resource owner\'s site. }'
});
```

### Making requests to the target meteor app.
Because each meteor application will define their apis in a different way,
this example is pretty generic. It gives you a general idea how things work.
```
HTTP.get(
    'http://meteorserver/custom/url',
    {
        param: {
            access_token: '<access token provided by service>'
        }
    }
);
```

### Examples
There is an example meteor application that demonstrates authentication from
another meteor application.
https://github.com/prime-8-consulting/meteor-oauth2/tree/master/examples

You will need to run both the resourceServer (the site that holds the usernames and passwords)
and the clientApplication (the site that performs the oauth request). There is
detailed instructions on how to start both applications. They are already
configured to work together, so you should have no problem getting things going.
