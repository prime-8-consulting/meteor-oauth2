if (_.isUndefined(MeteorOAuth2)) {
    MeteorOAuth2 = {
        serviceName: 'MeteorOAuth2Server'
    };
}

Accounts.oauth.registerService(MeteorOAuth2.serviceName);

if (Meteor.isClient) {
    Meteor['loginWith'+ MeteorOAuth2.serviceName] = function(options, callback) {
        if (! callback && typeof options === "function") {
            callback = options;
            options = null;
        }

        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
        MeteorOAuth2.requestCredential(options, credentialRequestCompleteCallback);
    };
} else {
    Accounts.addAutopublishFields({
        forLoggedInUser: ['services.'+ MeteorOAuth2.serviceName],
        forOtherUsers: []
    });
}