// reactive vars for our UI.
var grantResult = new ReactiveVar(null);
var tokenResult = new ReactiveVar(null);
var getUserIdResult = new ReactiveVar(null);

// subscribe to our authorization codes and refresh tokens.
Template.authorize.onCreated(function() {
    oAuth2Server.subscribeTo.authCode();
    oAuth2Server.subscribeTo.refreshTokens();
});

Template.authorize.helpers({
    urlParams: function() {
        return getUrlParams();
    },
    isUrlParamsValid: function() {
        var params = getUrlParams();
        return !!params.client_id && !!params.redirect_uri && !!params.response_type;
    },
    grantResult: function() {
        return grantResult.get();
    },
    tokenResult: function() {
        return tokenResult.get();
    },
    getUserIdResult: function() {
        return getUserIdResult.get();
    },
    authCodes: function() {
        return oAuth2Server.collections.authCode.find({});
    },
    refreshTokens: function() {
        return oAuth2Server.collections.refreshToken.find({});
    }
});

Template.authorize.events({
    // Step 3.
    // user clicks the authorize button.
    'click button.authorize': function() {
        console.log('Authorize button clicked.');
        var urlParams = getUrlParams();

        // create an authorization code for the provided client.
        oAuth2Server.callMethod.authCodeGrant(urlParams.client_id, urlParams.redirect_uri, urlParams.response_type, function(err, result) {
            console.log(err, result);

            // Step 4
            // give the UI something to display.
            grantResult.set(result);

            // Step 5.
            // we have an authorization code. Now get a token.
            if (result.success) {
                console.log('POST');
                HTTP.post(
                    Meteor.absoluteUrl('/oauth/token'),
                    {
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        params: {
                            grant_type: 'authorization_code',
                            client_id: urlParams.client_id,
                            client_secret: '12345',
                            code: result.authorizationCode
                        }
                    },
                    function(err, result) {
                        tokenResult.set(result.data);

                        // Step 6.
                        // we have an access token. Get the user from the REST service.
                        HTTP.get(
                            Meteor.absoluteUrl('/api/getUserId'),
                            {
                                params: {
                                    access_token: result.data.access_token
                                }
                            },
                            function(err, result) {
                                // set the userId.
                                getUserIdResult.set(result.data);
                            }
                        );
                    }
                );
            }
        });
    }
});

Template.authCodeItem.events({
    'click button.remove': function() {
        oAuth2Server.collections.authCode.remove(this._id);
    }
});

Template.refreshTokenItem.events({
    'click button.remove': function() {
        oAuth2Server.collections.refreshToken.remove(this._id);
    }
});

function getUrlParams() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    var urlParams = {};
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }

    return urlParams;
}
