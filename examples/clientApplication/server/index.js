Meteor.methods({
    /**
     * Convenience method for clearing out the service configuration. This should never exist in production.
     */
    resetServiceConfiguration: function() {
        ServiceConfiguration.configurations.remove({
            service: MeteorOAuth2.serviceName // using the constant provided by the package, easy for refactoring.
        });
    },

    /**
     * AUTH FLOW - Step A7.
     * We have an access token. Get the user from the REST service.
     * This will perform a server-to-server request for the identification of the user. This method
     * is not one you will need to implement as the oauth2 client package does this for you. We are
     * doing it here to demonstrate each step of the oauth2 process.
     */
    getUserId: function() {
        var user = Meteor.user();
        var serviceConfig = ServiceConfiguration.configurations.findOne({
            service: MeteorOAuth2.serviceName
        });


        return HTTP.get(
            serviceConfig.baseUrl + '/api/getUserId',
            {
                params: {
                    access_token: user.services.MeteorOAuth2Server.accessToken
                }
            }
        );
    }
});
