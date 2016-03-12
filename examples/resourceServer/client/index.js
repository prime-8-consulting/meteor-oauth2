// reactive vars for our UI.
var grantResult = new ReactiveVar(null);
var tokenResult = new ReactiveVar(null);
var getUserIdResult = new ReactiveVar(null);
var clientCount = new ReactiveVar(null);

Template.authorize.onCreated(function() {
    // subscribe to our authorization codes and refresh tokens.
    oAuth2Server.subscribeTo.authCode();
    oAuth2Server.subscribeTo.refreshTokens();

    // get teh client count.
    Meteor.call('clientCount', function(err, cnt) {
        clientCount.set(cnt);
    });
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
    },
    clientCount: function() {
        return clientCount.get();
    }
});

Template.authorize.events({
    /**
     * CONFIG FLOW - Step C1.1
     * Create an authorized client.
     */
    'submit #addClientForm': function (){
        var newClient = {
            active: true,
            clientId: $('#addClientForm input[name="clientId"]').val(),
            redirectUri: $('#addClientForm input[name="redirectUri"]').val(),
            clientSecret: $('#addClientForm input[name="clientSecret"]').val(),
            clientName: $('#addClientForm input[name="clientName"]').val()
        };

        Meteor.call('addClient', newClient, function() {
            Meteor.call('clientCount', function(err, cnt) {
                clientCount.set(cnt);
            });
        });

        return false;
    },

    /**
     * AUTH FLOW - Step A5.1
     * user clicks the authorize button.
     */
    'click button.authorize': function() {
        console.log('Authorize button clicked.');
        var urlParams = getUrlParams();

        // create an authorization code for the provided client.
        oAuth2Server.callMethod.authCodeGrant(
            urlParams.client_id,
            urlParams.redirect_uri,
            urlParams.response_type,
            urlParams.scope && urlParams.scope.split(' '),
            urlParams.state,
            function(err, result) {
                console.log(err, result);

                // give the UI something to display.
                grantResult.set(result);
            }
        );
    },

    /**
     * This entire code block is for testing purposes only. The functionality here is generally
     * implemented on the client application and this action tends to be server-to-server.
     */
    'click button.testLocalTokens': function() {
        var result = grantResult.get();
        var urlParams = getUrlParams();

        /**
         * AUTH FLOW - Step A5
         * We have an authorization code. Now get a token.
         */
        if (result.success) {
            console.log('POST');
            HTTP.post(
                Meteor.absoluteUrl('/oauth/token'),
                {
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        grant_type: 'authorization_code',
                        client_id: urlParams.client_id,
                        client_secret: '12345',
                        code: result.authorizationCode
                    }
                },
                function(err, result) {
                    /**
                     * AUTH FLOW - Step A6
                     */
                    tokenResult.set(result.data);

                    /**
                     * AUTH FLOW - Step A7.
                     * we have an access token. Get the user from the REST service. This service is defined
                     * in the /server/rest.js.
                     */
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
                } // function
            ); // HTTP.post
        } // if
    }, // function

    'click button.deleteAllClients': function() {
        Meteor.call('deleteAllClients', function() {
            Meteor.call('clientCount', function(err, cnt) {
                clientCount.set(cnt);
            });
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
