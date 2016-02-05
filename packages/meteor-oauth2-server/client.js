oAuth2Server.subscribeTo = {
    authCode: function() {
        return Meteor.subscribe(oAuth2Server.pubSubNames.authCodes);
    },
    refreshTokens: function() {
        return Meteor.subscribe(oAuth2Server.pubSubNames.refreshTokens);
    }
};

oAuth2Server.callMethod = {
    authCodeGrant: function(client_id, redirect_uri, response_type, callback) {
        Meteor.call(
            oAuth2Server.methodNames.authCodeGrant,
            client_id,
            redirect_uri,
            response_type,
            callback
        );
    }
};

