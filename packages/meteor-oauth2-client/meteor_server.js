var OAuth = Package.oauth.OAuth;
var Random = Package.random.Random;

OAuth.registerService(MeteorOAuth2.serviceName, 2, null, function(query) {
    console.log('query', query);
    var config = ServiceConfiguration.configurations.findOne({
        service: MeteorOAuth2.serviceName
    });

    if (!config) {
        throw new ServiceConfiguration.ConfigError("Service not configured");
    }

    if (!config.baseUrl) {
        throw new ServiceConfiguration.ConfigError("Service found but it does not have a baseUrl configured.");
    }

    if (!config.loginUrl) {
        throw new ServiceConfiguration.ConfigError("Service found but it does not have a loginUrl configured.");
    }

    var response = getTokenResponse(query, config);
    var accessToken = response.accessToken;
    var identity = getIdentity(accessToken, config);

    var serviceData = {
        id: identity.id,
        accessToken: accessToken,
        expiresAt: (+new Date) + (1000 * response.expiresIn),
        identity: identity
    };

    return {
        serviceData: serviceData,
        options: {
            profile: {
                name: identity.email
            }
        }
    };
});

var isJSON = function(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

var getTokenResponse = function(query, config) {
    var responseContent;
    try {
        responseContent = HTTP.post(
            config.baseUrl + '/oauth/token',
            {
                params: {
                    grant_type: 'authorization_code',
                    code: query.code,
                    client_id: config.clientId,
                    client_secret: OAuth.openSecret(config.secret),
                    redirect_uri: OAuth._redirectUri(MeteorOAuth2.serviceName, config)
                }
            }
        ).content;
    } catch (err) {
        throw new Error("Failed to complete OAuth handshake\n\n" + err.message);
    }

    if (!isJSON(responseContent)) {
        throw new Error("Failed to complete OAuth handshake" + responseContent);
    }

    var parsedResponse = JSON.parse(responseContent);
    var accessToken = parsedResponse.access_token;
    var expiresIn = parsedResponse.expires_in;

    if (!accessToken) {
        throw new Error("Failed to complete OAuth handshake\n\
      did not receive an oauth token.\n" + responseContent
        );
    }

    return {
        accessToken: accessToken,
        expiresIn: expiresIn
    };
};

var getIdentity = function(accessToken, config) {
    var fetchUrl = config.baseUrl + '/oauth/getIdentity';
    try {
        return HTTP.get(
            fetchUrl,
            {
                params: {
                    access_token: accessToken
                }
            }
        ).data;
    } catch (err) {
        throw new Error('Failed to fetch identity from '+ fetchUrl +'. ' + err.message);
    }
};

MeteorOAuth2.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};