var OAuth = Package.oauth.OAuth;
var urlUtil = Npm.require('url');

OAuth.registerService('meteorServer', 2, null, function(query) {
    var response = getTokenResponse(query);
    var accessToken = response.accessToken;
    var characters = getCharacters(accessToken);

    var serviceData = {
        id: Random.id(),
        accessToken: accessToken,
        expiresAt: (+new Date) + (1000 * response.expiresIn)
    };

    return {
        serviceData: serviceData,
        options: {
            profile: characters
        }
    };
});

var isJSON = function (str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

var getTokenResponse = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'meteorServer'});

    if (!config)
        throw new ServiceConfiguration.ConfigError("Service not configured");

    var responseContent;
    try {
        responseContent = Meteor.http.post(
            "https://us.battle.net/oauth/token?grant_type=authorization_code" +
            "&code=" + query.code +
            "&client_id=" + config.clientId +
            "&client_secret=" + OAuth.openSecret(config.secret) +
            "&redirect_uri=" + encodeURIComponent(Meteor.absoluteUrl("_oauth/battlenet?close"))
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

var getCharacters = function (accessToken) {
    try {
        return Meteor.http.get("https://us.api.battle.net/wow/user/characters", {
            params: { access_token: accessToken } }
        ).data;
    } catch (err) {
        throw new Error("Failed to fetch identity from Battlenet. " + err.message);
    }
};

Battlenet.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};