/**
 * This is an example where we use the oAuth2 server to allow/deny access to our REST service.
 * In this example, we will use JsonRoutes.
 */

/**
 * First we define the middle-ware to use. This ensures the oauth2 server validation code
 * is ran whenever /api/* is accessed from our server. Doing this let's your rest service
 * take full advantage of oauth2 without all the boiler plate.
 * It is expected whenever a /api url is called, a "access_token" is present in the
 * query or the body.
 */
JsonRoutes.Middleware.use(
    '/api/*',
    oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
);

/**
 * OAUTH FLOW - A7.2
 *
 * Here is an example of querying for and returning data. At this point, the api path
 * has been validated by the oAuth2 server package. So the code can execute
 * un-encumbered.
 * Note: this is a REST service and it can be called from any server any where. That
 * being said, this server has no concept if your user is authenticated or not. This
 * is the point of the "access_token". To get the userId, you will have to look it up
 * in the access token collection.
 */
JsonRoutes.add('get', '/api/getUserId', function(req, res, next) {
    console.log('GET /api/getUserId');

    var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    JsonRoutes.sendResult(res, {
        data: accessToken.userId
    });
});
