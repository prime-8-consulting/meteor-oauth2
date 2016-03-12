MeteorOAuth2.requestCredential = function (options, credentialRequestCompleteCallback) {
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({
        service: MeteorOAuth2.serviceName
    });

    if (!config) {
        credentialRequestCompleteCallback
        && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError('Service not configured')
        );
        return;
    }

    if (!config) {
        credentialRequestCompleteCallback
        && credentialRequestCompleteCallback(
            ServiceConfiguration.ConfigError('Service not configured')
        );
    }

    if (!config.baseUrl) {
        credentialRequestCompleteCallback
        && credentialRequestCompleteCallback(
            ServiceConfiguration.ConfigError('Service found but it does not have a baseUrl configured.')
        );
    }

    if (!config.loginUrl) {
        credentialRequestCompleteCallback
        && credentialRequestCompleteCallback(
            ServiceConfiguration.ConfigError('Service found but it does not have a loginUrl configured.')
        );
    }

    var credentialToken = Random.secret();

    // always need this to get user id from service.
    var requiredScope = ['email'];
    var scope = [];
    if (options.scope)
        scope = options.scope;
    scope = _.union(scope, requiredScope);


    var loginStyle = OAuth._loginStyle(MeteorOAuth2.serviceName, config, options);

    var loginUrl = config.loginUrl +
        '?response_type=code' +
        '&client_id=' + config.clientId +
        '&redirect_uri=' + OAuth._redirectUri(MeteorOAuth2.serviceName, config) +
        '&scope=' + scope.join(' ') +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);

    OAuth.launchLogin({
        loginService: MeteorOAuth2.serviceName,
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: { height: 600 }
    });
};
