/*
    All the code here is to demonstrate the two-way communication between the resource server and
    this client application. None of the code here is important when implementing the client on
    you site.
 */

var getUserIdResult = new ReactiveVar(null);

Template.main.helpers({
    getUserAccessToken: function() {
        return getUserAccessToken();
    },

    getUserIdResult: function() {
        return getUserIdResult.get();
    },

    getUserOAuth2Id: function() {
        var user = Meteor.user();

        if (!isOAuth2User(user)) {
            return;
        }

        return user.services.MeteorOAuth2Server.id;
    }
});

Template.main.events({
    /**
     * Wipe out all the configured services.
     */
    'click button.resetServiceConfiguration': function() {
        Meteor.call('resetServiceConfiguration');
    },

    /**
     * Perform a server-to-server request to get the user id on the resource server. This action exists
     * just to demonstrate the steps in the oauth2 process. The oauth2 client package does this for you
     * when logging in.
     */
    'click button.testLocalTokens': function() {
        if (getUserAccessToken()) {
            Meteor.call('getUserId', function(err, result) {
                console.log(result);
                // set the userId.
                getUserIdResult.set(result.data);
            });
        } // if
    } // function
});

/**
 * Determine if a user originates from an oauth2 login.
 * @param user
 * @returns {*}
 */
function isOAuth2User(user) {
    return user
        && user.services
        && user.services.MeteorOAuth2Server
        ;
}

/**
 * Get the user access token if it exists.
 * @returns {*}
 */
function getUserAccessToken() {
    var user = Meteor.user();

    if (!isOAuth2User(user)) {
        return;
    }

    return user.services.MeteorOAuth2Server.accessToken;
}
