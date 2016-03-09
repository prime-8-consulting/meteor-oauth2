/**
 * Convenience method for clearing out the service configuration. This should never exist in production.
 */
Meteor.methods({
    resetServiceConfiguration: function() {
        ServiceConfiguration.configurations.remove({
            service: MeteorOAuth2.serviceName // using the constant provided by the package, easy for refactoring.
        });
    }
});